import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Users, Package, Warehouse, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedStatCard from "@/components/dashboard/AnimatedStatCard";
import LiveActivityFeed from "@/components/dashboard/LiveActivityFeed";
import NetworkDiagram from "@/components/dashboard/NetworkDiagram";
import LiveClock from "@/components/dashboard/LiveClock";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: () => base44.entities.Customer.list() });
  const { data: products = [] }  = useQuery({ queryKey: ["products"],  queryFn: () => base44.entities.Product.list() });
  const { data: inventory = [] } = useQuery({ queryKey: ["inventory"], queryFn: () => base44.entities.Inventory.list() });

  const stats = [
    { label: "Customers",       value: customers.length, icon: Users,     color: "text-blue-600 bg-blue-50" },
    { label: "Products",        value: products.length,  icon: Package,   color: "text-emerald-600 bg-emerald-50" },
    { label: "Inventory Items", value: inventory.length, icon: Warehouse, color: "text-amber-600 bg-amber-50" },
    { label: "Cloud Services",  value: 8,                icon: Cloud,     color: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div
      className="p-6 max-w-6xl mx-auto space-y-6 min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at 20% 0%, hsl(215 28% 17% / 0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, hsl(217 91% 60% / 0.04) 0%, transparent 60%), white",
      }}
    >
      {/* Header row with clock */}
      <FadeSlide delay={0} mounted={mounted}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold">Clothing demo</h1>
            <p className="text-sm text-muted-foreground">Wholesale ERP migration — AWS infrastructure overview</p>
          </div>
          <LiveClock />
        </div>
      </FadeSlide>

      {/* Animated network diagram */}
      <FadeSlide delay={80} mounted={mounted}>
        <NetworkDiagram />
      </FadeSlide>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <AnimatedStatCard key={s.label} {...s} index={i} delay={160 + i * 80} />
        ))}
      </div>

      {/* Info cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <FadeSlide delay={500} mounted={mounted}>
          <
// @ts-ignore
          Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md h-full">
            <
// @ts-ignore
            CardContent className="p-5">
              <h3 className="font-heading font-semibold mb-3">Business Scenario</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A wholesale clothing company currently runs its ERP (product catalog), CRM (customer management), and WMS (warehouse inventory) on a local on-premises network. The goal is to migrate these systems to AWS cloud infrastructure to improve scalability, reliability, and remote access.
              </p>
            </CardContent>
          </Card>
        </FadeSlide>

        <FadeSlide delay={580} mounted={mounted}>
          <
// @ts-ignore
          Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md h-full">
            <
// @ts-ignore
            CardContent className="p-5">
              <h3 className="font-heading font-semibold mb-3">Migration Approach</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                {[
                  "Design VPC with public and private subnets",
                  "Deploy application server on EC2 in public subnet",
                  "Place RDS PostgreSQL in private subnet",
                  "Configure security groups and IAM roles",
                  "Set up CI/CD pipeline with GitHub Actions",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </FadeSlide>
      </div>

      {/* Live activity feed */}
      <FadeSlide delay={660} mounted={mounted}>
        <LiveActivityFeed />
      </FadeSlide>
    </div>
  );
}

// @ts-ignore
function FadeSlide({ children, delay = 0, mounted }) {
  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}