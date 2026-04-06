import React, { useMemo, useState } from 'react';
import { Plus, Edit, UserCheck, Users, ChefHat, TrendingUp } from 'lucide-react';
import { useRestaurant } from '../../lib/store';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/Card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { toast } from 'sonner';
import type { User, UserRole } from '../../lib/types';
export function StaffManagement() {
  const { users, addUser, updateUser, orders } = useRestaurant();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'waiter' as UserRole,
    isActive: true
  });
  const activeWaiters = users.filter(
    (u) => u.role === 'waiter' && u.isActive
  ).length;
  const kitchenStaff = users.filter(
    (u) => u.role === 'kitchen' && u.isActive
  ).length;
  const waiterPerformance = useMemo(() => {
    const perf: Record<
      string,
      {
        fullName: string;
        orderCount: number;
        revenue: number;
      }> =
    {};
    users.
    filter((u) => u.role === 'waiter').
    forEach((w) => {
      perf[w.id] = {
        fullName: w.fullName,
        orderCount: 0,
        revenue: 0
      };
    });
    orders.forEach((order) => {
      if (order.status !== 'cancelled' && perf[order.waiterId]) {
        perf[order.waiterId].orderCount += 1;
        perf[order.waiterId].revenue += order.total;
      }
    });
    return Object.values(perf).sort((a, b) => b.revenue - a.revenue);
  }, [users, orders]);
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) {
      toast.error('Full name is required');
      return;
    }
    addUser(formData);
    toast.success('Staff member added');
    setIsAddOpen(false);
    resetForm();
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, formData);
    toast.success('Staff member updated');
    setIsEditOpen(false);
  };
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive
    });
    setIsEditOpen(true);
  };
  const resetForm = () => {
    setFormData({
      fullName: '',
      role: 'waiter',
      isActive: true
    });
  };
  const roleColors: Record<UserRole, string> = {
    manager: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
    waiter: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    kitchen: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
  };
  const UserForm = ({
    onSubmit,
    submitLabel



  }: {onSubmit: (e: React.FormEvent) => void;submitLabel: string;}) =>
  <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
        id="fullName"
        value={formData.fullName}
        onChange={(e) =>
        setFormData({
          ...formData,
          fullName: e.target.value
        })
        }
        required />
      
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select
        value={formData.role}
        onValueChange={(v: UserRole) =>
        setFormData({
          ...formData,
          role: v
        })
        }>
        
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiter">Waiter</SelectItem>
            <SelectItem value="kitchen">Kitchen Staff</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 flex flex-col justify-center pt-2">
        <div className="flex items-center gap-2">
          <Switch
          checked={formData.isActive}
          onCheckedChange={(v) =>
          setFormData({
            ...formData,
            isActive: v
          })
          }
          id="isActive" />
        
          <Label htmlFor="isActive">
            {formData.isActive ? 'Active' : 'Inactive'}
          </Label>
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">
        {submitLabel}
      </Button>
    </form>;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-1">
            Staff Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage employees, roles, and view performance.
          </p>
        </div>
        <Dialog
          open={isAddOpen}
          onOpenChange={(open) => {
            setIsAddOpen(open);
            if (open) resetForm();
          }}>
          
          <DialogTrigger asChild>
            <Button size="sm" className="sm:size-default">
              <Plus className="w-4 h-4 mr-2" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleAddSubmit}
              submitLabel="Add Staff Member" />
            
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total Staff
              </CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold">
                {users.length}
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold">
                  {activeWaiters}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  Active Waiters
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold">
                  {kitchenStaff}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  Kitchen Staff
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2 p-3 sm:p-6">
            <CardTitle className="text-sm sm:text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />{' '}
              Waiter Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Waiter</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">
                    Orders
                  </TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">
                    Revenue
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waiterPerformance.slice(0, 5).map((perf, i) =>
                <TableRow key={perf.fullName}>
                    <TableCell className="font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                      {i === 0 && '🥇'}
                      {i === 1 && '🥈'}
                      {i === 2 && '🥉'} {perf.fullName}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">
                      {perf.orderCount}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs sm:text-sm">
                      ${perf.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">
            Staff Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <ScrollArea className="w-full">
            <div className="min-w-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Role</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) =>
                  <TableRow
                    key={u.id}
                    className={!u.isActive ? 'opacity-60' : ''}>
                    
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {u.fullName}
                      </TableCell>
                      <TableCell>
                        <Badge
                        variant="outline"
                        className={`capitalize text-[10px] sm:text-xs ${roleColors[u.role]}`}>
                        
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div
                          className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        
                          <span className="text-xs sm:text-sm">
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => openEditDialog(u)}>
                        
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleEditSubmit} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>);

}