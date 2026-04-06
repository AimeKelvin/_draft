import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  DollarSign,
  Utensils,
  Calendar,
  TrendingUp } from
'lucide-react';
import { useRestaurant } from '../../lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
import { TableCard } from '../../components/TableCard';
import { OrderCard } from '../../components/OrderCard';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { Button } from '../../components/ui/Button';
type DateFilter = 'today' | 'yesterday' | '7days' | '30days' | 'all';
const filterLabels: Record<DateFilter, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7days': 'Last 7 Days',
  '30days': 'Last 30 Days',
  all: 'All Time'
};
export function ManagerDashboard() {
  const { tables, orders, users, menuItems } = useRestaurant();
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
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
      switch (dateFilter) {
        case 'today':
          return orderTime >= today;
        case 'yesterday':
          return orderTime >= today - 86400000 && orderTime < today;
        case '7days':
          return orderTime >= today - 7 * 86400000;
        case '30days':
          return orderTime >= today - 30 * 86400000;
        case 'all':
        default:
          return true;
      }
    });
  }, [orders, dateFilter]);
  const stats = useMemo(() => {
    const validOrders = filteredOrders.filter((o) => o.status !== 'cancelled');
    const revenue = validOrders.reduce((sum, order) => sum + order.total, 0);
    const servedOrders = validOrders.filter((o) => o.status === 'served').length;
    const avgOrderValue =
    validOrders.length > 0 ? revenue / validOrders.length : 0;
    return [
    {
      title: 'Revenue',
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Total Orders',
      value: filteredOrders.length,
      icon: Receipt,
      color: 'text-blue-500'
    },
    {
      title: 'Orders Served',
      value: servedOrders,
      icon: Utensils,
      color: 'text-emerald-500'
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-amber-500'
    }];

  }, [filteredOrders]);
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-1">
            Manager Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Enterprise analytics and real-time operations overview.
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-card p-1 rounded-lg border overflow-x-auto -mx-1 px-1 scrollbar-none">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) =>
        <motion.div
          key={stat.title}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: i * 0.1
          }}>
          
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                <CardTitle className="text-[11px] sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color}`} />
              
              </CardHeader>
              <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                <div className="text-lg sm:text-2xl font-bold">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-heading font-semibold">
              Live Dining Tables
            </h2>
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-bold text-foreground">
                {occupiedTables}
              </span>{' '}
              / {tables.length} Occupied
            </div>
          </div>
          <Card className="h-[340px] sm:h-[400px]">
            <ScrollArea className="h-full p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-2">
                {tables.map((table) =>
                <TableCard key={table.id} table={table} />
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-heading font-semibold">
              Orders
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {filterLabels[dateFilter]}
            </span>
          </div>
          <Card className="h-[340px] sm:h-[400px] lg:h-[600px] flex flex-col">
            <ScrollArea className="flex-1 h-full p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                {filteredOrders.slice(0, 15).map((order) =>
                <OrderCard
                  key={order.id}
                  order={order}
                  tableNumber={tableMap[order.tableId]}
                  waiterName={userMap[order.waiterId]}
                  menuItemNames={menuItemMap} />

                )}
                {filteredOrders.length === 0 &&
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
                    <Calendar className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">No orders found for this period</p>
                  </div>
                }
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>);

}