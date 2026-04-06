import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Receipt, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Separator } from './ui/Separator';
import type { Order } from '../lib/types';
interface OrderCardProps {
  order: Order;
  tableNumber?: number;
  waiterName?: string;
  menuItemNames?: Record<string, string>;
  onClick?: () => void;
}
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
export function OrderCard({
  order,
  tableNumber,
  waiterName,
  menuItemNames,
  onClick
}: OrderCardProps) {
  const config = statusConfig[order.status];
  const timeAgo = Math.floor(
    (Date.now() - new Date(order.createdAt).getTime()) / 60000
  );
  return (
    <motion.div
      whileHover={
      onClick ?
      {
        scale: 1.01
      } :
      {}
      }
      whileTap={
      onClick ?
      {
        scale: 0.99
      } :
      {}
      }>
      
      <Card
        className={
        onClick ?
        'cursor-pointer hover:border-primary/50 transition-colors' :
        ''
        }>
        
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                Table {tableNumber || '?'}
                <span className="text-sm font-mono text-muted-foreground font-normal">
                  #{order.id}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <User className="w-3 h-3" />
                {waiterName || '?'}
              </div>
            </div>
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item) =>
            <div key={item.id} className="flex justify-between text-sm">
                <span className="truncate pr-4">
                  <span className="font-medium mr-2">{item.quantity}x</span>
                  {menuItemNames?.[item.menuItemId] || 'Unknown Item'}
                </span>
                <span className="text-muted-foreground">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            )}
            {order.items.length > 3 &&
            <div className="text-sm text-muted-foreground italic">
                + {order.items.length - 3} more items
              </div>
            }
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="pt-3 flex justify-between items-center bg-muted/10">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {timeAgo} min ago
          </div>
          <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
        </CardFooter>
      </Card>
    </motion.div>);

}