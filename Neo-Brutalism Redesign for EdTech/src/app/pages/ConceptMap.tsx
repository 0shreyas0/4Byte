import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Info, X, ArrowRight } from "lucide-react";

type NodeStatus = "strong" | "weak" | "critical" | "notstarted" | "inprogress";

interface ConceptNode {
  id: string;
  label: string;
  status: NodeStatus;
  x: number;
  y: number;
  chapter: string;
  score: number;
  description: string;
}

interface Edge {
  from: string;
  to: string;
}

const statusConfig: Record<NodeStatus, { bg: string; border: string; shadow: string; label: string; emoji: string }> = {
  strong:     { bg: "#34C759", border: "#000", shadow: "#28A046", label: "Strong",      emoji: "✅" },
  weak:       { bg: "#FFD60A", border: "#000", shadow: "#ccaa00", label: "Weak",        emoji: "⚠️" },
  critical:   { bg: "#FF3B30", border: "#000", shadow: "#cc2e25", label: "Critical",    emoji: "❌" },
  inprogress: { bg: "#0A84FF", border: "#000", shadow: "#0060CC", label: "In Progress", emoji: "🔵" },
  notstarted: { bg: "#E0E0E0", border: "#000", shadow: "#aaa",    label: "Not Started", emoji: "⬜" },
};

const nodes: ConceptNode[] = [
  { id: "algebra",        label: "ALGEBRA",        status: "strong",     x: 80,  y: 60,  chapter: "Chapter 1", score: 85, description: "Fundamental operations, equations, and expressions." },
  { id: "trigonometry",   label: "TRIGONOMETRY",   status: "weak",       x: 340, y: 60,  chapter: "Chapter 2", score: 55, description: "Sine, cosine, tangent and their applications." },
  { id: "functions",      label: "FUNCTIONS",      status: "weak",       x: 80,  y: 200, chapter: "Chapter 3", score: 42, description: "Mappings, domain, range, and function types." },
  { id: "limits",         label: "LIMITS",         status: "strong",     x: 340, y: 200, chapter: "Chapter 4", score: 78, description: "The concept of approaching a value." },
  { id: "matrices",       label: "MATRICES",       status: "notstarted", x: 80,  y: 340, chapter: "Chapter 5", score: 0,  description: "Arrays of numbers and linear transformations." },
  { id: "differentiation",label: "DIFFERENTIATION",status: "critical",   x: 340, y: 340, chapter: "Chapter 6", score: 18, description: "Rates of change and derivatives." },
  { id: "probability",    label: "PROBABILITY",    status: "strong",     x: 80,  y: 480, chapter: "Chapter 7", score: 91, description: "Likelihood and statistical reasoning." },
  { id: "integration",    label: "INTEGRATION",    status: "inprogress", x: 340, y: 480, chapter: "Chapter 8", score: 5,  description: "Area under curves and anti-derivatives." },
];

const edges: Edge[] = [
  { from: "algebra",         to: "functions" },
  { from: "algebra",         to: "trigonometry" },
  { from: "trigonometry",    to: "limits" },
  { from: "functions",       to: "limits" },
  { from: "functions",       to: "matrices" },
  { from: "limits",          to: "differentiation" },
  { from: "matrices",        to: "probability" },
  { from: "differentiation", to: "integration" },
];

const NODE_W = 160;
const NODE_H = 60;

export function ConceptMap() {
  const [selected, setSelected] = useState<ConceptNode | null>(null);
  const [filterStatus, setFilterStatus] = useState<NodeStatus | "all">("all");
  const navigate = useNavigate();

  const visibleNodes = filterStatus === "all"
    ? nodes
    : nodes.filter(n => n.status === filterStatus);

  const visibleIds = new Set(visibleNodes.map(n => n.id));

  const svgW = 580;
  const svgH = 580;

  const getCenter = (node: ConceptNode) => ({
    cx: node.x + NODE_W / 2,
    cy: node.y + NODE_H / 2,
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-black text-black text-2xl md:text-3xl uppercase tracking-tight">
            🧠 Concept Map
          </h1>
          <p className="font-bold text-black/60 text-sm mt-1">
            Visual overview of your math learning journey
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "strong", "weak", "critical", "inprogress", "notstarted"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 border-3 border-black font-black text-xs uppercase tracking-wide transition-all duration-100
                ${filterStatus === s
                  ? "bg-black text-white shadow-none translate-x-0.5 translate-y-0.5"
                  : "bg-white text-black shadow-[3px_3px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"}`}
            >
              {s === "all" ? "ALL" : `${statusConfig[s].emoji} ${s}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Map */}
        <div className="lg:col-span-2 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_black] overflow-auto">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            width="100%"
            style={{ minHeight: 300, maxHeight: 580 }}
          >
            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 100}
                y1={0}
                x2={i * 100}
                y2={svgH}
                stroke="#F0F0F0"
                strokeWidth={1}
              />
            ))}
            {[...Array(7)].map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 100}
                x2={svgW}
                y2={i * 100}
                stroke="#F0F0F0"
                strokeWidth={1}
              />
            ))}

            {/* Edges */}
            {edges
              .filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))
              .map((edge) => {
                const from = nodes.find(n => n.id === edge.from)!;
                const to = nodes.find(n => n.id === edge.to)!;
                const f = getCenter(from);
                const t = getCenter(to);
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    {/* Shadow line */}
                    <line
                      x1={f.cx + 3}
                      y1={f.cy + 3}
                      x2={t.cx + 3}
                      y2={t.cy + 3}
                      stroke="#000"
                      strokeWidth={5}
                      strokeOpacity={0.15}
                    />
                    <line
                      x1={f.cx}
                      y1={f.cy}
                      x2={t.cx}
                      y2={t.cy}
                      stroke="#000"
                      strokeWidth={3}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}

            {/* Arrowhead */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
              </marker>
            </defs>

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const cfg = statusConfig[node.status];
              const isSelected = selected?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelected(selected?.id === node.id ? null : node)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Shadow */}
                  <rect
                    x={node.x + 5}
                    y={node.y + 5}
                    width={NODE_W}
                    height={NODE_H}
                    fill={cfg.shadow}
                  />
                  {/* Main rect */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    fill={cfg.bg}
                    stroke="#000"
                    strokeWidth={isSelected ? 4 : 3}
                  />
                  {/* Label */}
                  <text
                    x={node.x + NODE_W / 2}
                    y={node.y + 24}
                    textAnchor="middle"
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight="900"
                    fontSize="11"
                    fill="#000"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + NODE_W / 2}
                    y={node.y + 40}
                    textAnchor="middle"
                    fontFamily="Space Grotesk, sans-serif"
                    fontWeight="700"
                    fontSize="9"
                    fill="rgba(0,0,0,0.6)"
                  >
                    {node.chapter} • {node.score}%
                  </text>
                  {/* Status badge */}
                  <text
                    x={node.x + NODE_W - 10}
                    y={node.y + 14}
                    textAnchor="end"
                    fontSize="12"
                  >
                    {cfg.emoji}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-3 border-black">
            {(Object.entries(statusConfig) as [NodeStatus, typeof statusConfig[NodeStatus]][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 border-2 border-black"
                  style={{ backgroundColor: val.bg }}
                />
                <span className="font-bold text-xs text-black uppercase">{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Detail Panel */}
        <div className="space-y-4">
          {selected ? (
            <div
              style={{
                backgroundColor: statusConfig[selected.status].bg,
                boxShadow: `6px 6px 0px ${statusConfig[selected.status].shadow}`,
              }}
              className="border-4 border-black p-5 pop-in"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-2xl mb-1">{statusConfig[selected.status].emoji}</div>
                  <h3 className="font-black text-black text-xl uppercase leading-tight">
                    {selected.label}
                  </h3>
                  <div className="text-black/70 font-bold text-xs uppercase mt-0.5">
                    {selected.chapter}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-7 h-7 bg-black flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <p className="text-black font-bold text-sm mb-4">{selected.description}</p>

              {/* Score bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-black text-xs text-black uppercase">Mastery</span>
                  <span className="font-black text-sm text-black">{selected.score}%</span>
                </div>
                <div className="h-5 bg-white/60 border-3 border-black">
                  <div
                    className="h-full bg-black border-r-2 border-black/20 transition-all"
                    style={{ width: `${selected.score}%` }}
                  />
                </div>
              </div>

              <div
                className="inline-block px-2 py-0.5 border-2 border-black font-black text-xs uppercase"
                style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                Status: {statusConfig[selected.status].label}
              </div>

              <button
                onClick={() => navigate("/practice")}
                className="mt-4 w-full bg-black text-white border-3 border-black py-3 font-black text-sm uppercase tracking-wide shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Practice This Topic
              </button>
            </div>
          ) : (
            <div className="border-4 border-black border-dashed p-6 text-center">
              <Info className="w-8 h-8 text-black/30 mx-auto mb-2" />
              <p className="font-black text-black/40 text-sm uppercase">
                Click a node to see details
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_black]">
            <h3 className="font-black text-black text-sm uppercase tracking-wide mb-3">
              📊 Topic Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(["strong", "weak", "critical", "notstarted"] as NodeStatus[]).map(s => {
                const count = nodes.filter(n => n.status === s).length;
                const cfg = statusConfig[s];
                return (
                  <div
                    key={s}
                    style={{ backgroundColor: cfg.bg, boxShadow: `3px 3px 0px ${cfg.shadow}` }}
                    className="border-3 border-black p-2 text-center"
                  >
                    <div className="font-black text-xl text-black">{count}</div>
                    <div className="font-bold text-[10px] text-black uppercase">{cfg.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-black border-4 border-black p-4 shadow-[6px_6px_0px_#FFD60A]">
            <h3 className="font-black text-[#FFD60A] text-sm uppercase tracking-wide mb-3">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: "Practice Weak Topics", path: "/practice", color: "#FFD60A" },
                { label: "View Analytics", path: "/analytics", color: "#0A84FF" },
                { label: "Go to Dashboard", path: "/", color: "#34C759" },
              ].map(({ label, path, color }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  style={{ backgroundColor: color, boxShadow: `3px 3px 0px white` }}
                  className="w-full border-2 border-white px-3 py-2 font-black text-xs text-black uppercase tracking-wide flex items-center justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  {label}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
