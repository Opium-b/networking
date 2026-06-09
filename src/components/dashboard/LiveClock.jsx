import { useEffect, useState } from "react";

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="text-right shrink-0">
      <p className="text-lg font-mono font-semibold tabular-nums leading-none">{timeStr}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{dateStr}</p>
    </div>
  );
}