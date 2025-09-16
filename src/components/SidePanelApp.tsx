import { useState, useEffect } from 'react';
import type { ShoppingListItem } from '../types';
import { StorageManager } from '../utils/storage';
import { ShoppingListView } from './ShoppingListView';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { PlusIcon, SearchIcon } from 'lucide-react';

export function SidePanelApp() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const shoppingList = await StorageManager.getShoppingList();
      setItems(shoppingList);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualItem = async () => {
    try {
      // Get current tab info
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const newItem: ShoppingListItem = {
        id: Date.now().toString(),
        productName: 'New Item',
        url: tab?.url || '',
        pageTitle: tab?.title || '',
        pageUrl: tab?.url || '',
        memo: '',
        dateAdded: new Date().toISOString(),
      };

      await StorageManager.addItem(newItem);
      await loadItems();
    } catch (error) {
      console.error('Error adding manual item:', error);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<ShoppingListItem>) => {
    try {
      await StorageManager.updateItem(id, updates);
      await loadItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await StorageManager.deleteItem(id);
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.memo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pageTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your shopping list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-foreground mb-4">AI Shopping List</h1>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddManualItem} size="icon">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <PlusIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your shopping list is empty</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'No items match your search.'
                    : 'Right-click on any product on a webpage and select "Add to Shopping List" to get started.'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddManualItem}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item Manually
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <ShoppingListView
            items={filteredItems}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </div>
    </div>
  );
}