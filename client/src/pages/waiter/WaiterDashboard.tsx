import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { useRestaurant, useAuth } from '../../lib/store';
import { TableCard } from '../../components/TableCard';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent } from
'../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
export function WaiterDashboard() {
  const { tables, orders, updateOrderStatus } = useRestaurant();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tableMap = useMemo(
    () => Object.fromEntries(tables.map((t) => [t.id, t.tableNumber])),
    [tables]
  );
  const myOrders = orders.filter((o) => o.waiterId === user?.id);
  const activeOrders = myOrders.filter(
    (o) => !['served', 'cancelled'].includes(o.status)
  );
  const recentOrders = myOrders.
  filter((o) => ['served', 'cancelled'].includes(o.status)).
  slice(0, 10);
  const handleServe = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrderStatus(orderId, 'served');
    toast.success('Order marked as served');
  };
  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-heading font-bold tracking-tight">
        Waiter Terminal
      </h1>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-11 sm:h-14">
          <TabsTrigger value="tables" className="text-xs sm:text-base">
            Tables
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-base relative">
            Active
            {activeOrders.length > 0 &&
            <span className="ml-1 sm:ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-destructive text-white">
                {activeOrders.length}
              </span>
            }
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs sm:text-base">
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="mt-4 sm:mt-6 outline-none">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg w-fit">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />{' '}
              Available
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />{' '}
              Occupied
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {tables.map((table) =>
            <TableCard
              key={table.id}
              table={table}
              onClick={() => navigate(`/table/${table.id}`)} />

            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-4 sm:mt-6 outline-none">
          {activeOrders.length === 0 ?
          <div className="text-center py-16 sm:py-20 text-muted-foreground flex flex-col items-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-20" />
              <p className="text-base sm:text-lg">No active orders</p>
              <p className="text-xs sm:text-sm">
                Select a table to start an order
              </p>
            </div> :

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {activeOrders.map((order) => {
              const timeAgo = Math.floor(
                (Date.now() - new Date(order.createdAt).getTime()) / 60000
              );
              const isReady = order.status === 'ready';
              return (
                <Card
                  key={order.id}
                  className={`cursor-pointer transition-colors hover:border-primary/50 ${isReady ? 'border-emerald-500 dark:border-emerald-500/50 shadow-sm' : ''}`}
                  onClick={() => navigate(`/table/${order.tableId}`)}>
                  
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div>
                          <div className="font-heading font-bold text-lg sm:text-xl">
                            Table {tableMap[order.tableId] || '?'}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {timeAgo} min ago
                          </div>
                        </div>
                        <Badge
                        variant={isReady ? 'default' : 'secondary'}
                        className={`text-[10px] sm:text-xs ${isReady ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
                        
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        {order.items.length} items • ${order.total.toFixed(2)}
                      </div>

                      {isReady ?
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 sm:h-10 text-sm"
                      onClick={(e) => handleServe(order.id, e)}>
                      
                          Mark as Served
                        </Button> :

                    <Button
                      variant="outline"
                      className="w-full h-9 sm:h-10 text-sm">
                      
                          View Order
                        </Button>
                    }
                    </CardContent>
                  </Card>);

            })}
            </div>
          }
        </TabsContent>

        <TabsContent value="recent" className="mt-4 sm:mt-6 outline-none">
          <Card>
            <div className="divide-y">
              {recentOrders.map((order) =>
              <div
                key={order.id}
                className="p-3 sm:p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center font-heading font-bold text-base sm:text-lg shrink-0">
                      T{tableMap[order.tableId] || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">
                        Order #{order.id}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="font-bold text-sm sm:text-base">
                      ${order.total.toFixed(2)}
                    </div>
                    <Badge
                    variant="outline"
                    className={`text-[10px] sm:text-xs ${order.status === 'cancelled' ? 'text-red-500 border-red-200' : 'text-emerald-500 border-emerald-200'}`}>
                    
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )}
              {recentOrders.length === 0 &&
              <div className="p-8 text-center text-muted-foreground text-sm">
                  No recent orders
                </div>
              }
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

}