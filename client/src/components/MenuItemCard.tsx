import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Switch } from './ui/Switch';
import type { MenuItem, UserRole } from '../lib/types';
interface MenuItemCardProps {
  item: MenuItem;
  role: UserRole;
  onAdd?: () => void;
  onEdit?: () => void;
  onToggleAvailability?: () => void;
}
export function MenuItemCard({
  item,
  role,
  onAdd,
  onEdit,
  onToggleAvailability
}: MenuItemCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      whileHover={{
        y: -2
      }}>
      
      <Card
        className={`overflow-hidden h-full flex flex-col ${!item.isAvailable ? 'opacity-70 grayscale-[0.5]' : ''}`}>
        
        <div className="relative h-40 w-full bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover" />
          
          {!item.isAvailable &&
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[2px]">
              <Badge variant="destructive" className="text-sm">
                Unavailable
              </Badge>
            </div>
          }
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading font-semibold text-lg line-clamp-1">
              {item.name}
            </h3>
            <span className="font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          {role === 'manager' &&
          <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Switch
                checked={item.isAvailable}
                onCheckedChange={onToggleAvailability}
                id={`avail-${item.id}`} />
              
                <label
                htmlFor={`avail-${item.id}`}
                className="text-xs text-muted-foreground cursor-pointer">
                
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </label>
              </div>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            </div>
          }

          {role === 'waiter' &&
          <Button
            className="w-full"
            onClick={onAdd}
            disabled={!item.isAvailable}>
            
              <Plus className="w-4 h-4 mr-2" /> Add to Order
            </Button>
          }
        </CardFooter>
      </Card>
    </motion.div>);

}