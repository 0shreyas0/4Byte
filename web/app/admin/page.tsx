"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AIMemory {
  user_id: string;
  type: string;
  domain: string;
  topic: string;
  content: string;
}

interface AdminStats {
  total_users: number;
  total_errors: number;
  total_memories: number;
  recent_logs: Array<{
    time: string;
    user_id: string;
    error_type: string;
    topic: string;
    snippet: string;
  }>;
  ai_memories: AIMemory[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const resp = await fetch("http://localhost:8000/admin/stats");
      if (!resp.ok) throw new Error("Failed to fetch admin stats");
      const data = await resp.json();
      setStats(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // 5s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8] overflow-hidden">
      <div className="text-2xl font-black italic uppercase animate-bounce">SYNCING WITH AI CEREBRUM...</div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F0E8] p-6 text-center">
      <div className="bg-red-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black mb-4 uppercase italic">Neural Link Failure</h1>
        <p className="font-bold mb-6 text-red-600">The Mentor backend is offline: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-black text-white px-8 py-3 font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase italic"
        >
          RETRY CONNECTION
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-6 lg:p-12 font-sans overflow-x-hidden selection:bg-yellow-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-default">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Brain <span className="text-blue-600">Admin</span>
            </h1>
            <p className="font-bold opacity-60 mt-2 uppercase text-sm tracking-widest">Global Memory + Error Dashboard</p>
          </div>
          
          <Link href="/">
            <div className="bg-black text-white border-4 border-black px-8 py-4 font-black uppercase shadow-[6px_6px_0px_0px_rgba(56,189,248,1)] hover:shadow-none transition-all italic hover:translate-x-1 hover:translate-y-1">
              &larr; BACK TO APP
            </div>
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[{ label: "Total Students", val: stats?.total_users, color: "bg-yellow-300" },
            { label: "Logged Mistakes", val: stats?.total_errors, color: "bg-pink-300" },
            { label: "AI Insights Learned", val: stats?.total_memories, color: "bg-[#00FF57]" }].map((s, idx) => (
            <div key={idx} className={`${s.color} border-4 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative`}>
              <h3 className="text-sm font-black uppercase mb-1 opacity-60">{s.label}</h3>
              <p className="text-7xl font-black tabular-nums">{s.val}</p>
              <div className="absolute top-4 right-4 text-2xl font-black italic">#{idx+1}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            
            {/* Recent Activity Table */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="bg-black text-white p-5 font-black uppercase text-xl flex justify-between items-center border-b-4 border-black">
                    <span>Recent Activity Log</span>
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-[#EFEFEF] border-b-4 border-black font-black uppercase text-xs">
                        <tr>
                            <th className="p-4 border-r-4 border-black">USER</th>
                            <th className="p-4 border-r-4 border-black">ISSUE</th>
                            <th className="p-4">CODE</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold text-sm divide-y-4 divide-black">
                        {stats?.recent_logs.map((log, i) => (
                        <tr key={i} className="hover:bg-yellow-50 transition-colors">
                            <td className="p-4 border-r-4 border-black text-blue-700 font-black">{log.user_id}</td>
                            <td className="p-4 border-r-4 border-black">
                                <span className="bg-black text-white px-2 py-0.5 text-[10px] uppercase italic">{log.error_type}</span>
                            </td>
                            <td className="p-4 bg-gray-50 font-mono text-[11px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                {log.snippet}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* AI Memories from VectorDB */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="bg-[#00FF57] text-black p-5 font-bold uppercase text-xl border-b-4 border-black flex justify-between items-center">
                    <span className="font-black">VectorDB Brain (Learned Insights)</span>
                    <span className="text-xs bg-black text-white px-2 py-1">LATEST 30</span>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto divide-y-4 divide-black">
                    {stats?.ai_memories.map((mem, i) => (
                        <div key={i} className="p-6 hover:bg-green-50 transition-colors bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                    <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase italic">
                                        {mem.user_id}
                                    </span>
                                    <span className="bg-blue-200 border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase">
                                        {mem.domain} &bull; {mem.topic}
                                    </span>
                                </div>
                                <span className={`text-[10px] uppercase font-black px-2 py-1 border-2 border-black ${
                                    mem.type === 'weakness' ? 'bg-red-400' : 'bg-green-400'
                                }`}>
                                    {mem.type}
                                </span>
                            </div>
                            <p className="font-bold text-sm leading-relaxed">&ldquo;{mem.content}&rdquo;</p>
                        </div>
                    ))}
                    {stats?.ai_memories.length === 0 && (
                        <div className="p-20 text-center opacity-30 font-black uppercase text-xl italic">
                            No learned patterns in VectorDB yet
                        </div>
                    )}
                </div>
            </div>

        </div>

        <div className="mt-20 text-center border-t-4 border-black pt-12">
            <h2 className="text-3xl font-black uppercase italic mb-2">System Status: Functional</h2>
            <p className="font-bold opacity-40 uppercase text-xs tracking-[0.5em]">&copy; 2026 NeuralPath EdTech Pipeline &bull; Local Hybrid Model</p>
        </div>
      </div>
    </div>
  );
}
