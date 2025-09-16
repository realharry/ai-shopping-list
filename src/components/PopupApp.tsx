import { useState, useEffect } from 'react';
import type { ShoppingListItem } from '../types';
import { StorageManager } from '../utils/storage';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ExternalLinkIcon, SettingsIcon, ShoppingCartIcon } from 'lucide-react';

export function PopupApp() {
  const [itemCount, setItemCount] = useState(0);
  const [recentItems, setRecentItems] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const items = await StorageManager.getShoppingList();
      setItemCount(items.length);
      setRecentItems(items.slice(0, 3)); // Show 3 most recent items
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const openSidePanel = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
        window.close();
      }
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
    window.close();
  };

  return (
    <div className="w-80 p-4 bg-background">
      <div className="text-center mb-4">
        <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
          <ShoppingCartIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">AI Shopping List</h1>
        <p className="text-sm text-muted-foreground">
          {itemCount} item{itemCount !== 1 ? 's' : ''} in your list
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <Button onClick={openSidePanel} className="w-full">
          <ExternalLinkIcon className="h-4 w-4 mr-2" />
          Open Shopping List
        </Button>
        
        <Button onClick={openOptions} variant="outline" className="w-full">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {recentItems.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Items</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    {item.price && (
                      <p className="text-xs text-primary">{item.price}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 pt-3 border-t text-center">
        <p className="text-xs text-muted-foreground">
          Right-click on any product to add it to your list
        </p>
      </div>
    </div>
  );
}