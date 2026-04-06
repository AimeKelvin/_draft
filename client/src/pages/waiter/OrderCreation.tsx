import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Send,
  ShoppingCart } from
'lucide-react';
import { useRestaurant, useAuth } from '../../lib/store';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Separator } from '../../components/ui/Separator';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/Sheet';
import { MenuItemCard } from '../../components/MenuItemCard';
import { toast } from 'sonner';
import type { OrderItem } from '../../lib/types';
interface CartItem extends
  Omit<OrderItem, 'id' | 'orderId' | 'status' | 'createdAt'> {
  cartId: string;
}
export function OrderCreation() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    tables,
    categories,
    menuItems,
    orders,
    createOrder,
    addItemsToOrder,
    updateOrderStatus
  } = useRestaurant();
  const table = tables.find((t) => t.id === tableId);
  const currentOrder = orders.find(
    (o) =>
    o.tableId === table?.id &&
    o.status !== 'served' &&
    o.status !== 'cancelled'
  );
  const menuItemMap = useMemo(
    () => Object.fromEntries(menuItems.map((m) => [m.id, m.name])),
    [menuItems]
  );
  const [activeTab, setActiveTab] = useState(categories[0]?.id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  if (!table || !user) return <div className="p-4">Table not found</div>;
  const addToCart = (menuItem: any) => {
    const existing = cart.find((item) => item.menuItemId === menuItem.id);
    if (existing) {
      setCart(
        cart.map((item) =>
        item.cartId === existing.cartId ?
        {
          ...item,
          quantity: item.quantity + 1
        } :
        item
        )
      );
    } else {
      setCart([
      ...cart,
      {
        cartId: Math.random().toString(36).substr(2, 9),
        menuItemId: menuItem.id,
        unitPrice: menuItem.price,
        quantity: 1
      }]
      );
    }
    toast.success(`Added ${menuItem.name}`);
  };
  const updateQuantity = (cartId: string, delta: number) => {
    setCart(
      cart.map((item) =>
      item.cartId === cartId ?
      {
        ...item,
        quantity: Math.max(1, item.quantity + delta)
      } :
      item
      )
    );
  };
  const removeFromCart = (cartId: string) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    const itemsToSubmit = cart.map(({ cartId, ...rest }) => ({
      ...rest,
      status: 'pending' as const
    }));
    if (currentOrder) {
      addItemsToOrder(currentOrder.id, itemsToSubmit);
      toast.success('Items added to existing order');
    } else {
      createOrder(table.id, user.id, itemsToSubmit);
      toast.success('New order created and sent to kitchen');
    }
    setCart([]);
    setCartOpen(false);
    navigate('/');
  };
  const handleServeOrder = () => {
    if (currentOrder) {
      updateOrderStatus(currentOrder.id, 'served');
      toast.success('Order marked as served and table cleared');
      navigate('/');
    }
  };
  const OrderSummaryContent = () =>
  <>
      <div className="flex-1 overflow-auto px-4 sm:px-6 py-4">
        {currentOrder && currentOrder.items.length > 0 &&
      <div className="mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Already Ordered
            </h4>
            <div className="space-y-2">
              {currentOrder.items.map((item) =>
          <div
            key={item.id}
            className="flex justify-between items-center text-xs sm:text-sm opacity-70">
            
                  <div className="flex gap-2 min-w-0">
                    <span className="font-medium shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="truncate">
                      {menuItemMap[item.menuItemId] || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge
                variant="outline"
                className="text-[9px] sm:text-[10px] uppercase">
                
                      {item.status}
                    </Badge>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
          )}
            </div>
            <Separator className="mt-4" />
          </div>
      }

        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
            New Items
          </h4>
          {cart.length === 0 ?
        <div className="text-center text-muted-foreground py-8 italic text-xs sm:text-sm">
              Cart is empty. Add items from the menu.
            </div> :

        <div className="space-y-3">
              {cart.map((item) =>
          <div
            key={item.cartId}
            className="flex flex-col gap-2 bg-muted/30 p-3 rounded-lg">
            
                  <div className="flex justify-between font-medium text-sm">
                    <span className="truncate pr-2">
                      {menuItemMap[item.menuItemId] || 'Unknown'}
                    </span>
                    <span className="shrink-0">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 bg-background rounded-md border">
                      <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.cartId, -1)}>
                  
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.cartId, 1)}>
                  
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeFromCart(item.cartId)}>
                
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
          )}
            </div>
        }
        </div>
      </div>

      <div className="shrink-0 p-4 sm:p-6 bg-muted/10 border-t">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-sm">New Items Total</span>
          <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
        </div>
        {currentOrder &&
      <div className="flex justify-between items-center mb-3 text-xs sm:text-sm text-muted-foreground">
            <span>Total with existing</span>
            <span>${(currentOrder.total + cartTotal).toFixed(2)}</span>
          </div>
      }
        <Button
        className="w-full h-11 sm:h-12 text-sm sm:text-lg"
        disabled={cart.length === 0}
        onClick={handleSubmitOrder}>
        
          <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Send to Kitchen
        </Button>
      </div>
    </>;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => navigate('/')}>
            
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-2xl font-heading font-bold flex items-center gap-2 sm:gap-3">
              Table {table.tableNumber}
              <Badge
                variant={table.status === 'available' ? 'default' : 'secondary'}
                className="text-[10px] sm:text-xs">
                
                {table.status}
              </Badge>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentOrder && currentOrder.status === 'ready' &&
          <Button
            onClick={handleServeOrder}
            className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm h-8 sm:h-10">
            
              Mark Served
            </Button>
          }
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden relative h-8 w-8 sm:h-10 sm:w-10">
                
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 &&
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                }
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] sm:w-[380px] p-0 flex flex-col">
              
              <div className="p-4 sm:p-6 border-b shrink-0">
                <h3 className="font-heading font-bold text-lg">
                  Order Summary
                </h3>
                {currentOrder &&
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Existing Order #{currentOrder.id}
                  </div>
                }
              </div>
              <OrderSummaryContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-0">
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0">
            
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-3 sm:mb-4 h-10 sm:h-12 p-1 shrink-0 scrollbar-none">
              {categories.map((cat) =>
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="min-w-fit px-3 sm:px-6 text-xs sm:text-sm">
                
                  {cat.name}
                </TabsTrigger>
              )}
            </TabsList>

            <div className="flex-1 overflow-hidden relative">
              {categories.map((cat) =>
              <TabsContent
                key={cat.id}
                value={cat.id}
                className="h-full m-0 data-[state=active]:flex flex-col">
                
                  <ScrollArea className="flex-1 pr-2 sm:pr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 pb-4">
                      {menuItems.
                    filter((item) => item.categoryId === cat.id).
                    map((item) =>
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      role="waiter"
                      onAdd={() => addToCart(item)} />

                    )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        <Card className="hidden lg:flex flex-col min-h-0">
          <CardHeader className="shrink-0 pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">
              Order Summary
            </CardTitle>
            {currentOrder &&
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Existing Order #{currentOrder.id}
              </div>
            }
          </CardHeader>
          <OrderSummaryContent />
        </Card>
      </div>

      {cart.length > 0 &&
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t p-3 sm:p-4 z-50 shadow-lg">
          <Button
          className="w-full h-11 sm:h-12"
          onClick={() => setCartOpen(true)}>
          
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart ({cart.length}) • ${cartTotal.toFixed(2)}
          </Button>
        </div>
      }
    </div>);

}