import { StorageManager } from './utils/storage';
import type { ShoppingListItem } from './types';

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'add-to-shopping-list',
    title: 'Add to Shopping List',
    contexts: ['selection', 'link', 'image', 'page'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'add-to-shopping-list' && tab?.id) {
    try {
      // Send message to content script to scrape product information
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'scrapeProduct',
        data: {
          selectionText: info.selectionText,
          linkUrl: info.linkUrl,
          srcUrl: info.srcUrl,
          pageUrl: info.pageUrl,
        },
      });

      if (response?.success) {
        // Add item to shopping list
        const item: ShoppingListItem = {
          id: Date.now().toString(),
          productName: response.data.productName || info.selectionText || 'Unnamed Product',
          price: response.data.price,
          url: response.data.productUrl || info.linkUrl || tab.url || '',
          pageTitle: tab.title || '',
          pageUrl: tab.url || '',
          imageUrl: response.data.imageUrl || info.srcUrl,
          memo: '',
          dateAdded: new Date().toISOString(),
          selector: response.data.selector,
        };

        await StorageManager.addItem(item);
        
        // Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'AI Shopping List',
          message: `Added "${item.productName}" to your shopping list`,
        });

        // Open side panel
        chrome.sidePanel.open({ tabId: tab.id });
      }
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
    }
  }
});

// Handle messages from content scripts and other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSidePanel' && sender.tab?.id) {
    chrome.sidePanel.open({ tabId: sender.tab.id });
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async response
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Handle storage changes for cross-tab synchronization
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.shoppingList) {
    // Broadcast storage changes to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'storageChanged',
            data: changes.shoppingList.newValue,
          }).catch(() => {
            // Ignore errors for tabs that don't have content script
          });
        }
      });
    });
  }
});