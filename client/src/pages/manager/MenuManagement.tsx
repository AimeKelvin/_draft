import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRestaurant } from '../../lib/store';
import { Button } from '../../components/ui/Button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../components/ui/Tabs';
import { MenuItemCard } from '../../components/MenuItemCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
'../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../../components/ui/Select';
import { toast } from 'sonner';
export function MenuManagement() {
  const { categories, menuItems, toggleItemAvailability, addMenuItem } =
  useRestaurant();
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    categoryId: categories[0]?.id || '',
    imageUrl:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  });
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }
    addMenuItem({
      name: newItem.name,
      price: parseFloat(newItem.price),
      categoryId: newItem.categoryId,
      imageUrl: newItem.imageUrl,
      isAvailable: true
    });
    toast.success('Menu item added successfully');
    setIsAddOpen(false);
    setNewItem({
      ...newItem,
      name: '',
      price: ''
    });
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-1">
            Menu Management
          </h1>
          <p className="text-muted-foreground">
            Manage categories, items, and availability.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    name: e.target.value
                  })
                  }
                  placeholder="e.g. Margherita Pizza" />
                
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newItem.categoryId}
                  onValueChange={(v) =>
                  setNewItem({
                    ...newItem,
                    categoryId: v
                  })
                  }>
                  
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) =>
                    <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price: e.target.value
                  })
                  }
                  placeholder="9.99" />
                
              </div>
              <Button type="submit" className="w-full mt-4">
                Save Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6 h-12 p-1 bg-muted/50">
          {categories.map((cat) =>
          <TabsTrigger key={cat.id} value={cat.id} className="min-w-fit px-6">
              {cat.name}
            </TabsTrigger>
          )}
        </TabsList>

        {categories.map((cat) =>
        <TabsContent
          key={cat.id}
          value={cat.id}
          className="mt-0 outline-none">
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.
            filter((item) => item.categoryId === cat.id).
            map((item) =>
            <MenuItemCard
              key={item.id}
              item={item}
              role="manager"
              onToggleAvailability={() => toggleItemAvailability(item.id)}
              onEdit={() => toast.info('Edit functionality coming soon')} />

            )}
            </div>
            {menuItems.filter((item) => item.categoryId === cat.id).length ===
          0 &&
          <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
                No items in this category yet.
              </div>
          }
          </TabsContent>
        )}
      </Tabs>
    </div>);

}