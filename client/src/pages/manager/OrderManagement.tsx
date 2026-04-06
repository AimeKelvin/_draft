import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useRestaurant } from '../../lib/store';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter } from
'../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { Separator } from '../../components/ui/Separator';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import type { OrderStatus } from '../../lib/types';
type DateFilter = 'today' | 'yesterday' | '7days' | '30days' | 'all';
const filterLabels: Record<DateFilter, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7days': 'Last 7 Days',
  '30days': 'Last 30 Days',
  all: 'All Time'
};
const statusTabs = [
{
  id: 'all',
  label: 'All Orders'
},
{
  id: 'pending',
  label: 'Pending'
},
{
  id: 'preparing',
  label: 'Preparing'
},
{
  id: 'ready',
  label: 'Ready'
},
{
  id: 'served',
  label: 'Served'
},
{
  id: 'cancelled',
  label: 'Cancelled'
}];

const statusConfig = {
  pending: {
    label: 'Pending',
    color:
    'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-200'
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200'
  },
  ready: {
    label: 'Ready',
    color:
    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200'
  },
  served: {
    label: 'Served',
    color:
    'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-200'
  }
};
export function OrderManagement() {
  const { orders, tables, users, menuItems, updateOrderStatus } =
  useRestaurant();
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const tableMap = useMemo(
    () => Object.fromEntries(tables.map((t) => [t.id, t.tableNumber])),
    [tables]
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.fullName])),
    [users]
  );
  const menuItemMap = useMemo(
    () => Object.fromEntries(menuItems.map((m) => [m.id, m.name])),
    [menuItems]
  );
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    return orders.filter((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      let dateMatch = true;
      switch (dateFilter) {
        case 'today':
          dateMatch = orderTime >= today;
          break;
        case 'yesterday':
          dateMatch = orderTime >= today - 86400000 && orderTime < today;
          break;
        case '7days':
          dateMatch = orderTime >= today - 7 * 86400000;
          break;
        case '30days':
          dateMatch = orderTime >= today - 30 * 86400000;
          break;
        case 'all':
        default:
          dateMatch = true;
      }
      const statusMatch =
      statusFilter === 'all' || order.status === statusFilter;
      return dateMatch && statusMatch;
    });
  }, [orders, dateFilter, statusFilter]);
  return (
    <div className="space-y-6 lg:space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-1">
            Order Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage all restaurant orders.
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-card p-1 rounded-lg border overflow-x-auto px-1 scrollbar-none">
          {(Object.keys(filterLabels) as DateFilter[]).map((filter) =>
          <Button
            key={filter}
            variant={dateFilter === filter ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setDateFilter(filter)}
            className="whitespace-nowrap text-xs sm:text-sm px-2.5 sm:px-4 shrink-0">
            
              {filterLabels[filter]}
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
        className="flex-1 flex flex-col min-h-0">
        
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-4 h-12 p-1 shrink-0 scrollbar-none">
          {statusTabs.map((tab) =>
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="min-w-fit px-4 sm:px-6">
            
              {tab.label}
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status];
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}>
                    
                    <Card className="flex flex-col h-full">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-heading flex items-center gap-2">
                              Table {tableMap[order.tableId] || '?'}
                              <span className="text-sm font-mono text-muted-foreground font-normal">
                                #{order.id}
                              </span>
                            </CardTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                              Waiter: {userMap[order.waiterId] || '?'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="outline" className={config.color}>
                            {config.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3 flex-1">
                        <div className="space-y-2">
                          {order.items.map((item) =>
                          <div
                            key={item.id}
                            className="flex justify-between text-sm">
                            
                              <span className="truncate pr-4">
                                <span className="font-medium mr-2">
                                  {item.quantity}x
                                </span>
                                {menuItemMap[item.menuItemId] || 'Unknown Item'}
                                {item.notes &&
                              <span className="block text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                                    Note: {item.notes}
                                  </span>
                              }
                              </span>
                              <span className="text-muted-foreground shrink-0">
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <Separator />
                      <CardFooter className="pt-3 flex flex-col gap-3 bg-muted/10">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-lg">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>

                        {order.status !== 'served' &&
                        order.status !== 'cancelled' &&
                        <div className="flex gap-2 w-full pt-2">
                              <Button
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() =>
                            updateOrderStatus(order.id, 'cancelled')
                            }>
                            
                                <XCircle className="w-4 h-4 mr-2" /> Cancel
                              </Button>
                              <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() =>
                            updateOrderStatus(order.id, 'served')
                            }>
                            
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark
                                Served
                              </Button>
                            </div>
                        }
                      </CardFooter>
                    </Card>
                  </motion.div>);

              })}
            </div>

            {filteredOrders.length === 0 &&
            <div className="text-center text-muted-foreground py-20 flex flex-col items-center justify-center h-full">
                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            }
          </ScrollArea>
        </div>
      </Tabs>
    </div>);

}