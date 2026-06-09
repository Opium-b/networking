import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

function useCountUp(target, duration = 1500, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

export default function AnimatedStatCard({ label, value, icon: Icon, color, delay = 0, index = 0 }) {
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1500, delay + 200);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <Card className="group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80">
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${color} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-heading font-bold tabular-nums">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}