import type { ProductScrapingResult } from './types';
import { StorageManager } from './utils/storage';

// Initialize content script
console.log('AI Shopping List content script loaded');

// Helper function to get text content safely
function getTextContent(element: Element | null): string {
  return element?.textContent?.trim() || '';
}

// Product scraping function using Chrome's Prompt API or fallback methods
async function scrapeProductInfo(contextData: any): Promise<ProductScrapingResult> {
  const result: ProductScrapingResult = {
    productName: '',
    price: undefined,
    imageUrl: undefined,
    productUrl: undefined,
  };

  try {
    // Get settings to check LLM configuration
    const settings = await StorageManager.getSettings();
    
    if (settings.llmConfig.provider === 'chrome-ai' && 'ai' in window) {
      // Try using Chrome's built-in AI
      try {
        const session = await (window as any).ai.languageModel.create({
          systemPrompt: `You are a product information extractor. Analyze the webpage and extract product information. Return a JSON object with productName, price (if found), imageUrl (if found), and productUrl (if found). Only return valid JSON.`
        });

        const htmlContext = document.documentElement.outerHTML.substring(0, 10000); // Limit to first 10k characters
        const prompt = `Extract product information from this HTML context: ${htmlContext}`;
        
        const response = await session.prompt(prompt);
        const aiResult = JSON.parse(response);
        
        if (aiResult.productName) {
          result.productName = aiResult.productName;
        }
        if (aiResult.price) {
          result.price = aiResult.price;
        }
        if (aiResult.imageUrl) {
          result.imageUrl = aiResult.imageUrl;
        }
        if (aiResult.productUrl) {
          result.productUrl = aiResult.productUrl;
        }
      } catch (aiError) {
        console.log('Chrome AI not available, falling back to manual scraping');
      }
    }

    // Fallback to manual scraping if AI didn't work or isn't available
    if (!result.productName) {
      // Try to extract product name from selection or page elements
      if (contextData.selectionText) {
        result.productName = contextData.selectionText;
      } else {
        // Common product name selectors
        const productNameSelectors = [
          'h1[data-testid*="product"]',
          'h1[class*="product"]',
          'h1[class*="title"]',
          '[data-testid*="product-name"]',
          '[class*="product-name"]',
          '[class*="product-title"]',
          'h1',
          '.title',
          '#product-title',
        ];

        for (const selector of productNameSelectors) {
          const element = document.querySelector(selector);
          if (element && getTextContent(element)) {
            result.productName = getTextContent(element);
            break;
          }
        }
      }
    }

    // Try to extract price
    if (!result.price) {
      const priceSelectors = [
        '[data-testid*="price"]',
        '[class*="price"]',
        '[class*="cost"]',
        '.price-current',
        '.current-price',
        '.sale-price',
        '.price',
        '[data-price]',
      ];

      for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        const text = getTextContent(element);
        if (text && /[\$£€¥₹][\d,]+\.?\d*/.test(text)) {
          result.price = text.match(/[\$£€¥₹][\d,]+\.?\d*/)?.[0];
          break;
        }
      }
    }

    // Try to extract product image
    if (!result.imageUrl && contextData.srcUrl) {
      result.imageUrl = contextData.srcUrl;
    } else if (!result.imageUrl) {
      const imageSelectors = [
        '[data-testid*="product"] img',
        '[class*="product"] img',
        '[class*="hero"] img',
        '.product-image img',
        '#product-image',
        'img[alt*="product"]',
        'main img',
      ];

      for (const selector of imageSelectors) {
        const img = document.querySelector(selector) as HTMLImageElement;
        if (img && img.src && !img.src.includes('placeholder')) {
          result.imageUrl = img.src;
          break;
        }
      }
    }

    // Try to extract product URL
    if (!result.productUrl && contextData.linkUrl) {
      result.productUrl = contextData.linkUrl;
    } else if (!result.productUrl) {
      // Use current page URL if it seems to be a product page
      const url = window.location.href;
      if (url.includes('product') || url.includes('item') || url.includes('/p/') || url.includes('/dp/')) {
        result.productUrl = url;
      }
    }

    // Clean up product name
    if (result.productName) {
      result.productName = result.productName.replace(/\s+/g, ' ').trim();
      if (result.productName.length > 100) {
        result.productName = result.productName.substring(0, 100) + '...';
      }
    }

  } catch (error) {
    console.error('Error scraping product info:', error);
  }

  return result;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.action === 'scrapeProduct') {
    try {
      const productInfo = await scrapeProductInfo(request.data);
      sendResponse({
        success: true,
        data: productInfo,
      });
    } catch (error) {
      console.error('Error in content script:', error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else if (request.action === 'storageChanged') {
    // Handle storage changes if needed
    console.log('Shopping list updated:', request.data);
  }

  return true; // Keep message channel open for async response
});

// Add visual feedback when hovering over elements (optional enhancement)
let highlightedElement: HTMLElement | null = null;

document.addEventListener('contextmenu', (event) => {
  // Remove previous highlight
  if (highlightedElement) {
    highlightedElement.style.outline = '';
  }

  // Highlight current element
  const target = event.target as HTMLElement;
  if (target && target !== document.body) {
    highlightedElement = target;
    target.style.outline = '2px solid #4285f4';
    
    // Remove highlight after a delay
    setTimeout(() => {
      if (highlightedElement) {
        highlightedElement.style.outline = '';
        highlightedElement = null;
      }
    }, 3000);
  }
});