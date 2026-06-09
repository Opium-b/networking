import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import EntityTable from "../components/EntityTable";
import EntityFormDialog from "../components/EntityFormDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

const fields = [
  { key: "sku", label: "SKU", required: true, placeholder: "e.g. SH-001" },
  { key: "name", label: "Product Name", required: true },
  { key: "category", label: "Category", type: "select", options: ["Shirts", "Pants", "Jackets", "Dresses", "Accessories"], required: true },
  { key: "unit_price", label: "Unit Price ($)", type: "number", required: true },
  { key: "description", label: "Description" },
];

const columns = [
  { key: "sku", label: "SKU", render: (v) => <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{v}</span> },
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "unit_price", label: "Price", render: (v) => `$${Number(v).toFixed(2)}` },
];

export default function Products() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.Product.list() });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const create = useMutation({ mutationFn: (d) => base44.entities.Product.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }) });
  const update = useMutation({ mutationFn: ({ id, ...d }) => base44.entities.Product.update(id, d), onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }) });
  const remove = useMutation({ mutationFn: (id) => base44.entities.Product.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }) });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">ERP — Product Catalog Management</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <EntityTable columns={columns} data={products} onEdit={(r) => { setEditing(r); setFormOpen(true); }} onDelete={(r) => setDeleting(r)} />
          )}
        </CardContent>
      </Card>
      <EntityFormDialog open={formOpen} onOpenChange={setFormOpen} title={editing ? "Edit Product" : "New Product"} fields={fields} initialData={editing} onSubmit={async (d) => { editing ? await update.mutateAsync({ id: editing.id, ...d }) : await create.mutateAsync(d); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={() => setDeleting(null)} itemName={deleting?.name} onConfirm={async () => { await remove.mutateAsync(deleting.id); setDeleting(null); }} />
    </div>
  );
}