"use client";

import React, { useState, useEffect } from "react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ZAxis,
  Cell,
  ReferenceArea
} from "recharts";
import { Zap, Loader2, AlertCircle } from "lucide-react";

interface PerformanceData {
    session: number;
    time: number;
    score: number;
    topic: string;
    date: string;
}

export default function PerformanceGraphJS({ userId }: { userId: string }) {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
        try {
            setError(false);
            setLoading(true);
            
            // Use environment variable or fallback to localhost
            // Detection logic for local/network testing
            let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!baseUrl) {
                const host = window.location.hostname;
                baseUrl = `http://${host}:8000`;
            }
            
            // Add timeout to fetch
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const resp = await fetch(`${baseUrl}/user/performance/${userId}`, {
                credentials: 'omit',
                signal: controller.signal,
            });
            clearTimeout(timeout);
            
            if (!resp.ok) throw new Error(`Backend returned ${resp.status}: ${resp.statusText}`);
            
            const json = await resp.json();
            setData(json.performance || []);
            setError(false);
        } catch (err) {
            console.error("Failed to load performance data", err);
            setError(true);
            setData([]);
        } finally {
            setLoading(false);
        }
    }
    
    if (userId && userId.trim()) {
        fetchData();
    } else {
        setLoading(false);
        setError(false);
    }
  }, [userId]);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center p-20 border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
              <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
              <p className="font-black uppercase tracking-widest text-sm italic">SYNCHRONIZING NEURAL DATA...</p>
          </div>
      );
  }

  if (error && data.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-12 border-4 border-black bg-red-50 shadow-[8px_8px_0_0_rgba(239,68,68,1)]">
            <AlertCircle className="text-red-500 mb-2" size={32} />
            <p className="font-black uppercase text-sm">Offline Mode</p>
            <p className="text-[10px] font-bold opacity-60">Connect to local RAG server to view live metrics.</p>
        </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-50">
           <p className="font-black text-xs uppercase mb-2 border-b-2 border-black pb-1">{point.topic}</p>
           <div className="space-y-1">
             <p className="text-sm font-bold flex justify-between gap-4">
                <span className="opacity-50 text-[10px]">DURATION:</span> 
                <span>{point.time} MIN</span>
             </p>
             <p className="text-sm font-black text-blue-600 flex justify-between gap-4">
                <span className="opacity-50 text-[10px] text-black">ACCURACY:</span> 
                <span>{point.score}%</span>
             </p>
           </div>
           <p className="text-[9px] opacity-40 mt-2 font-black border-t border-black/10 pt-1 tracking-tighter">
             TS_{new Date(point.date).getTime()}
           </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full h-[450px] flex flex-col relative group transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
      {/* Decorative Scanline */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-blue-500/20 group-hover:animate-scan z-10 pointer-events-none" />
      
      <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
          <div className="flex items-center gap-3">
              <div className="bg-black p-2 shadow-[2px_2px_0_0_rgba(255,214,10,1)]">
                  <Zap size={20} className="text-yellow-400" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-black italic uppercase leading-none tracking-tighter text-xl">
                      CORE <span className="text-blue-600">ANALYTICS</span>
                    </h3>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-0.5">Cognitive Performance Map</span>
                </div>
          </div>
          <div className="flex items-center gap-2 bg-black px-3 py-1 self-start shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
               <span className="text-[9px] font-black uppercase text-white tracking-widest">STABLE_REL_JS</span>
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center select-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:16px_16px] opacity-40">
                <p className="font-black text-3xl uppercase italic tracking-tighter text-black">AWAITING INPUT</p>
                <div className="max-w-[240px]">
                    <p className="font-bold text-[11px] leading-tight uppercase">Perform a Quiz or Coding Session to generate your first performance data point.</p>
                </div>
                <div className="w-32 h-1 bg-black animate-pulse mt-2" />
            </div>
        ) : (
            <div className="h-full w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#00000015" vertical={false} />
                        
                        {/* Status Zones */}
                        <ReferenceArea x1={0} x2={20} y1={80} y2={100} fill="#22C55E" fillOpacity={0.05} />
                        <ReferenceArea x1={40} x2={60} y1={0} y2={45} fill="#EF4444" fillOpacity={0.05} />
                        
                        <XAxis 
                            type="number" 
                            dataKey="time" 
                            name="Time" 
                            unit="min" 
                            domain={[0, 60]}
                            tick={{fontWeight: 900, fontSize: 9, fill: '#000'}}
                            label={{ value: 'SESSION DURATION', position: 'insideBottom', offset: -15, fontWeight: 900, fontSize: 9, letterSpacing: '0.1em' }}
                            axisLine={{ strokeWidth: 3, stroke: '#000' }}
                            tickLine={{ strokeWidth: 2, stroke: '#000' }}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="score" 
                            name="Score" 
                            unit="%" 
                            domain={[0, 100]}
                            tick={{fontWeight: 900, fontSize: 9, fill: '#000'}}
                            label={{ value: 'ACCURACY %', angle: -90, position: 'insideLeft', offset: 15, fontWeight: 900, fontSize: 9, letterSpacing: '0.1em' }}
                            axisLine={{ strokeWidth: 3, stroke: '#000' }}
                            tickLine={{ strokeWidth: 2, stroke: '#000' }}
                        />
                        <ZAxis type="number" range={[150, 450]} />
                        
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ strokeDasharray: '4 4', stroke: '#000', strokeWidth: 2 }} 
                            animationDuration={150}
                        />
                        
                        <Scatter 
                            name="Sessions" 
                            data={data} 
                            animationBegin={0}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={index === data.length - 1 ? "#38BDF8" : "black"} 
                                stroke="#000"
                                strokeWidth={2}
                                className="transition-all duration-300 hover:scale-125 cursor-pointer"
                            />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="border-3 border-black p-2 bg-green-50 flex items-center justify-center gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <div className="w-3 h-3 bg-green-500 border-2 border-black" />
              <span className="text-[9px] font-black uppercase italic tracking-tighter">Velocity Zone</span>
          </div>
          <div className="border-3 border-black p-2 bg-red-50 flex items-center justify-center gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <div className="w-3 h-3 bg-red-500 border-2 border-black" />
              <span className="text-[9px] font-black uppercase italic tracking-tighter">Attention Req.</span>
          </div>
      </div>
    </div>
  );
}
