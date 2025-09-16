import { useState } from 'react';
import type { ShoppingListItem } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { ExternalLinkIcon, EditIcon, TrashIcon, SaveIcon, XIcon } from 'lucide-react';

interface ShoppingListViewProps {
  items: ShoppingListItem[];
  onUpdateItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  onDeleteItem: (id: string) => void;
}

interface EditingItem {
  id: string;
  productName: string;
  price: string;
  memo: string;
}

export function ShoppingListView({ items, onUpdateItem, onDeleteItem }: ShoppingListViewProps) {
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const handleEdit = (item: ShoppingListItem) => {
    setEditingItem({
      id: item.id,
      productName: item.productName,
      price: item.price || '',
      memo: item.memo || '',
    });
  };

  const handleSave = () => {
    if (editingItem) {
      onUpdateItem(editingItem.id, {
        productName: editingItem.productName,
        price: editingItem.price || undefined,
        memo: editingItem.memo || undefined,
      });
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDeleteItem(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {editingItem?.id === item.id ? (
              // Editing mode
              <div className="space-y-3">
                <Input
                  value={editingItem.productName}
                  onChange={(e) => setEditingItem({ ...editingItem, productName: e.target.value })}
                  placeholder="Product name"
                  className="font-medium"
                />
                <Input
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  placeholder="Price"
                />
                <Input
                  value={editingItem.memo}
                  onChange={(e) => setEditingItem({ ...editingItem, memo: e.target.value })}
                  placeholder="Add a note..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <SaveIcon className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <XIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {item.productName}
                        </h3>
                        {item.price && (
                          <p className="text-lg font-semibold text-primary">
                            {item.price}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {item.memo && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                        {item.memo}
                      </p>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <p>From: {item.pageTitle}</p>
                      <p>Added: {formatDate(item.dateAdded)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => window.open(item.url, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      size="sm"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}