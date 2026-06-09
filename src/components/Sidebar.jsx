import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, Warehouse, Network, FileCode, GitBranch, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Customers (CRM)", path: "/customers", icon: Users },
  { label: "Products (ERP)", path: "/products", icon: Package },
  { label: "Inventory (WMS)", path: "/inventory", icon: Warehouse },
  { divider: true },
  { label: "Architecture", path: "/architecture", icon: Network },
  { label: "Terraform / IaC", path: "/infrastructure", icon: FileCode },
  { label: "CI/CD Pipeline", path: "/cicd", icon: GitBranch },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-primary text-primary-foreground flex flex-col">
      <div className="p-5 border-b border-white/10">
        <h1 className="font-heading text-lg font-bold tracking-tight">CloudNet Demo</h1>
        <p className="text-xs text-primary-foreground/60 mt-0.5">Wholesale ERP Migration</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item, i) =>
          item.divider ? (
            <div key={i} className="my-3 border-t border-white/10" />
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-white/15 text-white"
                  : "text-primary-foreground/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        )}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary-foreground/70 hover:bg-white/10 hover:text-white w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}