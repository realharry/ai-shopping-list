export interface ShoppingListItem {
  id: string;
  productName: string;
  price?: string;
  url: string;
  pageTitle: string;
  pageUrl: string;
  imageUrl?: string;
  memo?: string;
  dateAdded: string;
  selector?: string; // CSS selector for the product element
}

export interface LLMConfig {
  provider: 'chrome-ai' | 'openai' | 'anthropic' | 'custom';
  apiUrl?: string;
  apiKey?: string;
  model?: string;
}

export interface ExtensionSettings {
  llmConfig: LLMConfig;
  autoScrapeEnabled: boolean;
}

export interface ProductScrapingResult {
  productName: string;
  price?: string;
  imageUrl?: string;
  productUrl?: string;
}