import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

const SEED_EVENTS = [
  { id: 1, msg: "New customer added — Tashkent Textiles", type: "customer", time: "just now" },
  { id: 2, msg: "Inventory updated — Blue Denim Jacket (qty: 48)", type: "inventory", time: "12s ago" },
  { id: 3, msg: "Cloud service healthy — RDS PostgreSQL", type: "cloud", time: "31s ago" },
  { id: 4, msg: "Product created — Classic White Shirt (SKU: WS-001)", type: "product", time: "1m ago" },
  { id: 5, msg: "New customer added — Samarkand Fashion Group", type: "customer", time: "2m ago" },
  { id: 6, msg: "Security group rule applied — sg-web port 80", type: "cloud", time: "3m ago" },
];

const POOL = [
  { msg: "Inventory item restocked — Black Wool Coat (qty: 30)", type: "inventory" },
  { msg: "New customer added — Bukhara Wholesale Ltd", type: "customer" },
  { msg: "EC2 instance health check passed", type: "cloud" },
  { msg: "Product updated — Slim Fit Chinos (price adjusted)", type: "product" },
  { msg: "New order received — Order #1042", type: "order" },
  { msg: "Cloud service scaled up — Auto Scaling Group", type: "cloud" },
  { msg: "Customer profile updated — Fergana Apparel Co.", type: "customer" },
  { msg: "Inventory alert — Red Leather Jacket low stock", type: "inventory" },
  { msg: "Docker image built successfully — wholesale-erp:latest", type: "cloud" },
  { msg: "New product added — Summer Linen Blazer (SKU: LB-022)", type: "product" },
  { msg: "CI/CD pipeline passed — 4/4 tests green", type: "cloud" },
  { msg: "New customer added — Andijan Trading House", type: "customer" },
];

const TYPE_STYLES = {
  customer: "bg-blue-100 text-blue-700",
  inventory: "bg-amber-100 text-amber-700",
  cloud: "bg-violet-100 text-violet-700",
  product: "bg-emerald-100 text-emerald-700",
  order: "bg-rose-100 text-rose-700",
};

const TYPE_DOT = {
  customer: "bg-blue-500",
  inventory: "bg-amber-500",
  cloud: "bg-violet-500",
  product: "bg-emerald-500",
  order: "bg-rose-500",
};

let counter = 100;

export default function LiveActivityFeed() {
  const [events, setEvents] = useState(SEED_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const item = POOL[Math.floor(Math.random() * POOL.length)];
      counter++;
      setEvents((prev) => [
        { id: counter, msg: item.msg, type: item.type, time: "just now", fresh: true },
        ...prev.map((e) => ({ ...e, fresh: false })).slice(0, 5),
      ]);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <
// @ts-ignore
    Card className="transition-all duration-300 hover:shadow-md">
      <
// @ts-ignore
      CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h3 className="font-heading font-semibold text-sm">Live Activity</h3>
          <span className="ml-auto text-xs text-muted-foreground">Updates every ~9s</span>
        </div>
        <div className="space-y-2 overflow-hidden">
          {events.map((e, i) => (
            <div
              key={e.id}
              className="flex items-start gap-3 transition-all duration-500"
              style={{
                // @ts-ignore
                opacity: e.fresh ? 0 : 1,
                // @ts-ignore
                animation: e.fresh ? "slideInFeed 0.5s ease forwards" : undefined,
              }}
            >
              <div className="mt-1.5 shrink-0">
                <span className={`inline-block h-2 w-2 rounded-full ${
// @ts-ignore
                TYPE_DOT[e.type] || "bg-slate-400"}`} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{e.msg}</p>
              <span className="text-xs text-muted-foreground/60 shrink-0 whitespace-nowrap">{e.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <style>{`
        @keyframes slideInFeed {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  );
}
