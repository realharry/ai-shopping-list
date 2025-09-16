import type { ShoppingListItem, ExtensionSettings } from '../types';

export const STORAGE_KEYS = {
  SHOPPING_LIST: 'shoppingList',
  SETTINGS: 'settings',
} as const;

export class StorageManager {
  static async getShoppingList(): Promise<ShoppingListItem[]> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.SHOPPING_LIST);
      return result[STORAGE_KEYS.SHOPPING_LIST] || [];
    } catch (error) {
      console.error('Error getting shopping list:', error);
      return [];
    }
  }

  static async saveShoppingList(items: ShoppingListItem[]): Promise<void> {
    try {
      await chrome.storage.local.set({
        [STORAGE_KEYS.SHOPPING_LIST]: items,
      });
    } catch (error) {
      console.error('Error saving shopping list:', error);
    }
  }

  static async addItem(item: ShoppingListItem): Promise<void> {
    const items = await this.getShoppingList();
    items.unshift(item); // Add to beginning
    await this.saveShoppingList(items);
  }

  static async updateItem(id: string, updates: Partial<ShoppingListItem>): Promise<void> {
    const items = await this.getShoppingList();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      await this.saveShoppingList(items);
    }
  }

  static async deleteItem(id: string): Promise<void> {
    const items = await this.getShoppingList();
    const filteredItems = items.filter(item => item.id !== id);
    await this.saveShoppingList(filteredItems);
  }

  static async getSettings(): Promise<ExtensionSettings> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
      return result[STORAGE_KEYS.SETTINGS] || {
        llmConfig: {
          provider: 'chrome-ai',
        },
        autoScrapeEnabled: true,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        llmConfig: {
          provider: 'chrome-ai',
        },
        autoScrapeEnabled: true,
      };
    }
  }

  static async saveSettings(settings: ExtensionSettings): Promise<void> {
    try {
      await chrome.storage.local.set({
        [STORAGE_KEYS.SETTINGS]: settings,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
}