import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import EntityTable from "../components/EntityTable";
import EntityFormDialog from "../components/EntityFormDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";

const fields = [
  { key: "product_name", label: "Product Name", required: true },
  { key: "sku", label: "SKU", required: true },
  { key: "quantity", label: "Quantity", type: "number", required: true },
  { key: "warehouse", label: "Warehouse", type: "select", options: ["Warehouse A", "Warehouse B", "Warehouse C"], required: true },
  { key: "reorder_level", label: "Reorder Level", type: "number" },
  { key: "status", label: "Status", type: "select", options: ["In Stock", "Low Stock", "Out of Stock"], default: "In Stock" },
];

const statusColor = { "In Stock": "default", "Low Stock": "secondary", "Out of Stock": "destructive" };

const columns = [
  { key: "product_name", label: "Product" },
  { key: "sku", label: "SKU", render: (v) => <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{v}</span> },
  { key: "quantity", label: "Qty" },
  { key: "warehouse", label: "Warehouse" },
  { key: "status", label: "Status", render: (v) => <Badge variant={statusColor[v] || "secondary"}>{v}</Badge> },
];

export default function Inventory() {
  const qc = useQueryClient();
  const { data: inventory = [], isLoading } = useQuery({ queryKey: ["inventory"], queryFn: () => base44.entities.Inventory.list() });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const create = useMutation({ mutationFn: (d) => base44.entities.Inventory.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }) });
  const update = useMutation({ mutationFn: ({ id, ...d }) => base44.entities.Inventory.update(id, d), onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }) });
  const remove = useMutation({ mutationFn: (id) => base44.entities.Inventory.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }) });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">WMS — Warehouse Management System</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Item</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <EntityTable columns={columns} data={inventory} onEdit={(r) => { setEditing(r); setFormOpen(true); }} onDelete={(r) => setDeleting(r)} />
          )}
        </CardContent>
      </Card>
      <EntityFormDialog open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit Inventory Item" : "New Inventory Item"} fields={fields} initialData={editing} onSubmit={async (d) => { editing ? await update.mutateAsync({ id: editing.id, ...d }) : await create.mutateAsync(d); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={() => setDeleting(null)} itemName={deleting?.product_name} onConfirm={async () => { await remove.mutateAsync(deleting.id); setDeleting(null); }} />
    </div>
  );
}