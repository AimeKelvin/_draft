import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
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
  DialogTrigger,
  DialogFooter } from
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
import { TableCard } from '../../components/TableCard';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { toast } from 'sonner';
import type { DiningTable, TableStatus } from '../../lib/types';
export function TableManagement() {
  const { tables, addTable, updateTable, deleteTable } = useRestaurant();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    status: 'available' as TableStatus
  });
  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length
  };
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tableNumber) {
      toast.error('Table number is required');
      return;
    }
    const num = parseInt(formData.tableNumber);
    if (tables.some((t) => t.tableNumber === num)) {
      toast.error('Table number already exists');
      return;
    }
    addTable({
      tableNumber: num,
      status: formData.status
    });
    toast.success('Table added successfully');
    setIsAddOpen(false);
    resetForm();
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    const num = parseInt(formData.tableNumber);
    if (
    num !== selectedTable.tableNumber &&
    tables.some((t) => t.tableNumber === num))
    {
      toast.error('Table number already exists');
      return;
    }
    updateTable(selectedTable.id, {
      tableNumber: num,
      status: formData.status
    });
    toast.success('Table updated successfully');
    setIsEditOpen(false);
  };
  const handleDelete = () => {
    if (!selectedTable) return;
    if (selectedTable.status === 'occupied') {
      toast.error('Cannot delete an occupied table');
      return;
    }
    deleteTable(selectedTable.id);
    toast.success('Table deleted successfully');
    setIsDeleteOpen(false);
  };
  const openEditDialog = (table: DiningTable) => {
    setSelectedTable(table);
    setFormData({
      tableNumber: table.tableNumber.toString(),
      status: table.status
    });
    setIsEditOpen(true);
  };
  const openDeleteDialog = (table: DiningTable) => {
    setSelectedTable(table);
    setIsDeleteOpen(true);
  };
  const resetForm = () => {
    setFormData({
      tableNumber: '',
      status: 'available'
    });
  };
  const TableForm = ({
    onSubmit,
    submitLabel



  }: {onSubmit: (e: React.FormEvent) => void;submitLabel: string;}) =>
  <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="tableNumber">Table Number *</Label>
        <Input
        id="tableNumber"
        type="number"
        min="1"
        value={formData.tableNumber}
        onChange={(e) =>
        setFormData({
          ...formData,
          tableNumber: e.target.value
        })
        }
        required />
      
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
        value={formData.status}
        onValueChange={(v: TableStatus) =>
        setFormData({
          ...formData,
          status: v
        })
        }>
        
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full mt-4">
        {submitLabel}
      </Button>
    </form>;

  return (
    <div className="space-y-6 sm:space-y-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-1">
            Table Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage dining tables and status.
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
              <Plus className="w-4 h-4 mr-2" /> Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <TableForm onSubmit={handleAddSubmit} submitLabel="Add Table" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 shrink-0">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tables</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.available}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.occupied}</div>
              <div className="text-xs text-muted-foreground">Occupied</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
            {tables.
            sort((a, b) => a.tableNumber - b.tableNumber).
            map((table) =>
            <div key={table.id} className="relative group">
                  <TableCard table={table} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 bg-background/80 backdrop-blur shadow-sm hover:bg-background"
                  onClick={() => openEditDialog(table)}>
                  
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 shadow-sm"
                  onClick={() => openDeleteDialog(table)}>
                  
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Table {selectedTable?.tableNumber}</DialogTitle>
          </DialogHeader>
          <TableForm onSubmit={handleEditSubmit} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Table</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete Table {selectedTable?.tableNumber}
              ?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}