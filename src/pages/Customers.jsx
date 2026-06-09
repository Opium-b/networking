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
  { key: "name", label: "Company Name", required: true },
  { key: "contact_person", label: "Contact Person", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], default: "Active" },
];

const columns = [
  { key: "name", label: "Company" },
  { key: "contact_person", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
  { key: "status", label: "Status", render: (v) => <Badge variant={v === "Active" ? "default" : "secondary"}>{v}</Badge> },
];

export default function Customers() {
  const qc = useQueryClient();
  const { data: customers = [], isLoading } = useQuery({ queryKey: ["customers"], queryFn: () => base44.entities.Customer.list() });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const create = useMutation({ mutationFn: (d) => base44.entities.Customer.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); } });
  const update = useMutation({ mutationFn: ({ id, ...d }) => base44.entities.Customer.update(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); } });
  const remove = useMutation({ mutationFn: (id) => base44.entities.Customer.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); } });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">CRM — Customer Relationship Management</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Customer</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <EntityTable columns={columns} data={customers} onEdit={(r) => { setEditing(r); setFormOpen(true); }} onDelete={(r) => setDeleting(r)} />
          )}
        </CardContent>
      </Card>
      <EntityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit Customer" : "New Customer"}
        fields={fields}
        initialData={editing}
        onSubmit={async (d) => { editing ? await update.mutateAsync({ id: editing.id, ...d }) : await create.mutateAsync(d); }}
      />
      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={() => setDeleting(null)}
        itemName={deleting?.name}
        onConfirm={async () => { await remove.mutateAsync(deleting.id); setDeleting(null); }}
      />
    </div>
  );
}