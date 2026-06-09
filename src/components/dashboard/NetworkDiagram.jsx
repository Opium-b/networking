import { useEffect, useRef, useState } from "react";

const NODES = [
  { id: "user",     x: 60,  y: 80, label: "Users",           sub: "Browser / API",     color: "#3b82f6", icon: "👤" },
  { id: "igw",      x: 210, y: 80, label: "Internet Gateway", sub: "AWS IGW",           color: "#8b5cf6", icon: "🌐" },
  { id: "ec2",      x: 380, y: 80, label: "EC2 Instance",     sub: "FastAPI + Docker",  color: "#10b981", icon: "⚙️" },
  { id: "rds",      x: 550, y: 80, label: "RDS PostgreSQL",   sub: "Private Subnet",    color: "#f59e0b", icon: "🗄️" },
];

const EDGES = [
  { from: "user", to: "igw" },
  { from: "igw",  to: "ec2" },
  { from: "ec2",  to: "rds" },
];

function getNodeCenter(node) {
  return { x: node.x + 60, y: node.y + 30 };
}

export default function NetworkDiagram() {
  const [dots, setDots] = useState([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const edgeIdx = Math.floor(Math.random() * EDGES.length);
      counterRef.current++;
      setDots((prev) => [
        ...prev.filter((d) => d.progress < 1),
        { id: counterRef.current, edgeIdx, progress: 0 },
      ]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let raf;
    const tick = () => {
      setDots((prev) =>
        prev
          .map((d) => ({ ...d, progress: d.progress + 0.012 }))
          .filter((d) => d.progress <= 1)
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function getDotPos(dot) {
    const edge = EDGES[dot.edgeIdx];
    const from = getNodeCenter(NODES.find((n) => n.id === edge.from));
    const to   = getNodeCenter(NODES.find((n) => n.id === edge.to));
    const t = dot.progress;
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden relative" style={{ height: 180 }}>
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <svg
        viewBox="0 0 660 160"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection lines */}
        {EDGES.map((edge, i) => {
          const from = getNodeCenter(NODES.find((n) => n.id === edge.from));
          const to   = getNodeCenter(NODES.find((n) => n.id === edge.to));
          return (
            <line
              key={i}
              x1={from.x} y1={from.y}
              x2={to.x}   y2={to.y}
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          );
        })}

        {/* Animated dots */}
        {dots.map((dot) => {
          const pos = getDotPos(dot);
          const edge = EDGES[dot.edgeIdx];
          const toNode = NODES.find((n) => n.id === edge.to);
          return (
            <circle
              key={dot.id}
              cx={pos.x} cy={pos.y}
              r="4"
              fill={toNode.color}
              opacity={0.9 - dot.progress * 0.3}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const cx = node.x + 60;
          const cy = node.y + 30;
          return (
            <g key={node.id}>
              {/* glow ring */}
              <circle cx={cx} cy={cy} r="26" fill={node.color} opacity="0.12" />
              {/* main circle */}
              <circle cx={cx} cy={cy} r="20" fill="#1e293b" stroke={node.color} strokeWidth="2" />
              {/* emoji label */}
              <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13">{node.icon}</text>
              {/* name */}
              <text x={cx} y={node.y + 70} textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">
                {node.label}
              </text>
              <text x={cx} y={node.y + 82} textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="Inter, sans-serif">
                {node.sub}
              </text>
            </g>
          );
        })}

        {/* Arrows between nodes */}
        {EDGES.map((edge, i) => {
          const from = getNodeCenter(NODES.find((n) => n.id === edge.from));
          const to   = getNodeCenter(NODES.find((n) => n.id === edge.to));
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / len;
          const uy = dy / len;
          const ax = to.x - ux * 22;
          const ay = to.y - uy * 22;
          return (
            <polygon
              key={`a${i}`}
              points={`${ax},${ay} ${ax - ux * 8 - uy * 5},${ay - uy * 8 + ux * 5} ${ax - ux * 8 + uy * 5},${ay - uy * 8 - ux * 5}`}
              fill="#475569"
            />
          );
        })}
      </svg>

      {/* overlay label */}
      <div className="absolute top-3 left-4 text-white/70 text-xs font-mono">
        live data flow
      </div>
      <div className="absolute top-3 right-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-emerald-400 text-xs font-mono">connected</span>
      </div>
    </div>
  );
}