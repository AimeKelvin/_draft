import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, ChefHat, Flame } from 'lucide-react';
import { useRestaurant } from '../../lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ScrollArea } from '../../components/ui/ScrollArea';
export function KitchenDashboard() {
  const { orders, tables, menuItems, updateOrderItemStatus } = useRestaurant();
  const tableMap = useMemo(
    () => Object.fromEntries(tables.map((t) => [t.id, t.tableNumber])),
    [tables]
  );
  const menuItemMap = useMemo(
    () => Object.fromEntries(menuItems.map((m) => [m.id, m.name])),
    [menuItems]
  );
  const activeOrders = orders.filter(
    (o) => !['served', 'cancelled'].includes(o.status)
  );
  const allItems = activeOrders.flatMap((order) =>
  order.items.map((item) => ({
    ...item,
    tableNumber: tableMap[order.tableId],
    orderTime: order.createdAt
  }))
  );
  const pendingItems = allItems.filter((i) => i.status === 'pending');
  const cookingItems = allItems.filter((i) => i.status === 'cooking');
  const readyItems = allItems.filter((i) => i.status === 'ready');
  const columns = [
  {
    id: 'pending',
    title: 'Pending',
    icon: Clock,
    color: 'text-slate-500',
    items: pendingItems,
    actionLabel: 'Start Cooking',
    nextStatus: 'cooking' as const,
    actionColor: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  {
    id: 'cooking',
    title: 'Cooking',
    icon: Flame,
    color: 'text-blue-500',
    items: cookingItems,
    actionLabel: 'Mark Ready',
    nextStatus: 'ready' as const,
    actionColor: 'bg-emerald-500 hover:bg-emerald-600 text-white'
  },
  {
    id: 'ready',
    title: 'Ready',
    icon: CheckCircle,
    color: 'text-emerald-500',
    items: readyItems,
    actionLabel: null,
    nextStatus: null,
    actionColor: ''
  }];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)]">
      <div className="mb-4 sm:mb-6 shrink-0">
        <h1 className="text-xl sm:text-3xl font-heading font-bold tracking-tight mb-1 flex items-center gap-2 sm:gap-3">
          <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" /> Kitchen
          Display
        </h1>
        <p className="text-xs sm:text-base text-muted-foreground">
          Manage order items and preparation status.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-h-0">
        {columns.map((col) =>
        <Card
          key={col.id}
          className="flex flex-col min-h-0 md:min-h-[400px] bg-muted/30 border-dashed">
          
            <CardHeader className="shrink-0 pb-2 sm:pb-3 border-b bg-card rounded-t-xl p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-lg flex items-center gap-2">
                  <col.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${col.color}`} />
                  {col.title}
                </CardTitle>
                <Badge
                variant="secondary"
                className="text-xs sm:text-sm font-bold">
                
                  {col.items.length}
                </Badge>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                {col.items.map((item) => {
                const waitTime = Math.floor(
                  (Date.now() - new Date(item.orderTime).getTime()) / 60000
                );
                const isUrgent = waitTime > 15 && col.id !== 'ready';
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}>
                    
                      <Card
                      className={`border-l-4 ${isUrgent ? 'border-l-destructive' : col.id === 'pending' ? 'border-l-slate-400' : col.id === 'cooking' ? 'border-l-blue-500' : 'border-l-emerald-500'}`}>
                      
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-sm sm:text-lg leading-tight min-w-0 truncate pr-2">
                              {item.quantity}x{' '}
                              {menuItemMap[item.menuItemId] || 'Unknown'}
                            </div>
                            <Badge
                            variant="outline"
                            className="font-mono text-[10px] sm:text-xs whitespace-nowrap shrink-0">
                            
                              T-{item.tableNumber || '?'}
                            </Badge>
                          </div>

                          {item.notes &&
                        <div className="text-xs sm:text-sm bg-amber-500/10 text-amber-700 dark:text-amber-400 p-2 rounded mb-2 sm:mb-3 font-medium">
                              Note: {item.notes}
                            </div>
                        }

                          <div className="flex items-center justify-between mt-3 sm:mt-4">
                            <div
                            className={`text-[10px] sm:text-xs flex items-center gap-1 ${isUrgent ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                            
                              <Clock className="w-3 h-3" /> {waitTime} min
                            </div>
                            {col.nextStatus &&
                          <Button
                            size="sm"
                            className={`${col.actionColor} text-xs sm:text-sm h-7 sm:h-8`}
                            onClick={() =>
                            updateOrderItemStatus(
                              item.orderId,
                              item.id,
                              col.nextStatus!
                            )
                            }>
                            
                                {col.actionLabel}
                              </Button>
                          }
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>);

              })}
                {col.items.length === 0 &&
              <div className="text-center text-muted-foreground py-6 sm:py-8 italic text-xs sm:text-sm">
                    No items {col.title.toLowerCase()}
                  </div>
              }
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>);

}