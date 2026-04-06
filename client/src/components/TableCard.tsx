import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import type { DiningTable } from '../lib/types';
interface TableCardProps {
  table: DiningTable;
  onClick?: () => void;
}
const statusConfig = {
  available: {
    label: 'Available',
    color:
    'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500'
  },
  occupied: {
    label: 'Occupied',
    color:
    'bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    dot: 'bg-red-500'
  }
};
export function TableCard({ table, onClick }: TableCardProps) {
  const config = statusConfig[table.status];
  return (
    <motion.div
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.98
      }}>
      
      <Card
        className={`${onClick ? 'cursor-pointer' : ''} transition-colors hover:border-primary/50 ${table.status === 'occupied' ? 'border-red-200 dark:border-red-900/50' : ''}`}
        onClick={onClick}>
        
        <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center gap-3">
          <div className="flex w-full justify-between items-start">
            <span className="text-xl sm:text-2xl font-bold font-heading">
              T{table.tableNumber}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs ${config.color}`}>
              
              {config.label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>);

}