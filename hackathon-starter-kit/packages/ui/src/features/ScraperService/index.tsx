'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Terminal, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileJson,
  Database,
  Layers,
  Activity,
  Code,
  Eye,
  Info,
  Clock,
  Hash,
  Image,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { cn } from '../../utils/cn';

interface ScrapeResult {
  pages_scraped: number;
  data: Array<{
    url: string;
    title: string;
    text: string;
    links: string[];
    metadata?: Record<string, any>;
  }>;
}

export const ScraperService: React.FC = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(1);
  const [type, setType] = useState<'generic' | 'news' | 'finance'>('generic');
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [viewMode, setViewMode] = useState<'content' | 'meta' | 'json'>('content');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const executeScrape = async () => {
    if (!url) return;
    setIsScraping(true);
    setResult(null);
    setLogs([]);
    
    addLog(`INITIALIZING: Starting ${type} sequence...`);
    
    try {
      const endpoint = type === 'generic' ? '/scrape' : `/scrape/${type}`;
      const payload = {
        url,
        depth: depth,
        type: type
      };

      addLog(`NETWORK: Connecting to FastAPI node @ port 8000...`);
      
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`TRANSMISSION_ERROR: ${response.statusText}`);
      }

      addLog(`FETCHING: Receiving data stream from ${url}...`);
      const data = await response.json();
      
      addLog(`PARSING: Extracting structured intelligence...`);
      await new Promise(r => setTimeout(r, 500));
      
      addLog(`COMPLETE: ${data.pages_scraped} pages successfully promoted to data layer.`);
      setResult(data);
    } catch (err: any) {
      addLog(`FATAL: ${err.message}`);
      addLog(`HINT: Ensure the Python server is running on localhost:8000`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 p-4 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Globe size={20} />
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-foreground truncate break-all">Scraper Service</h2>
          </div>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium uppercase tracking-tight opacity-60 truncate">High-Performance Ingestion Microservice</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 shrink-0">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-green-500" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-green-600 whitespace-nowrap">Backend Online</span>
           </div>
           <div className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase opacity-40">Python 3.9 · FastAPI</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Control Panel */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
          <Card className="p-6 border-primary/10 bg-primary/[0.02] space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target URL</label>
              <Input 
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background/80 border-primary/10"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Scraper Type</label>
              <div className="flex flex-wrap gap-2">
                {['generic', 'news', 'finance'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t as any)}
                    className={cn(
                      "flex-1 min-w-[70px] py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider border transition-all truncate",
                      type === t 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background border-border hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Crawl Depth</label>
                <span className="text-[10px] font-bold text-primary">{depth} Levels</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                value={depth} 
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <Button 
              className="w-full h-12 rounded-2xl gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
              disabled={isScraping || !url}
              onClick={executeScrape}
            >
              {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              {isScraping ? 'Extracting Intelligence...' : 'Execute Scraper'}
            </Button>
          </Card>

          {/* Integration Tip */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
               <FileJson size={16} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest">API Endpoint</p>
              <p className="text-[9px] text-muted-foreground leading-relaxed">Service exposes strictly structured JSON for direct Knowledge Engine ingestion.</p>
            </div>
          </div>
        </div>

        {/* Console / Output */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Console */}
          <div className="rounded-3xl bg-black border border-white/10 shadow-2xl overflow-hidden font-mono min-h-[220px] flex flex-col">
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
               </div>
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Scraper System Console</span>
            </div>
            <div className="p-4 flex-1 space-y-1.5 overflow-y-auto no-scrollbar h-[180px]">
              {logs.length === 0 && (
                <div className="flex items-center gap-2 text-white/20 italic text-[11px] h-full justify-center">
                  <Terminal size={14} />
                  <span>Awaiting transmission parameters...</span>
                </div>
              )}
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="text-[11px] text-green-400/80 leading-relaxed truncate"
                >
                  <span className="opacity-40 mr-2">$</span>
                  {log}
                </motion.div>
              ))}
              {isScraping && (
                <div className="flex items-center gap-2 text-primary animate-pulse text-[11px] pt-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Processing operational sequence...</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Database size={12} className="text-primary" />
                    Intelligence Node Output
                  </h3>
                  <div className="flex gap-2">
                    {(['content', 'meta', 'json'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all",
                          viewMode === mode 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "bg-background border border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Card className="p-0 border-white/10 bg-black/40 shadow-2xl overflow-hidden rounded-[32px]">
                  {result.data.length > 0 ? (
                    <>
                      {/* Result Header */}
                      <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/40 flex items-center justify-between">
                        <div className="flex items-center gap-3 truncate min-w-0">
                           <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                              <CheckCircle2 size={16} />
                           </div>
                           <div className="min-w-0">
                              <h4 className="text-xs font-black text-white uppercase tracking-widest truncate">{result.data[0]?.title || 'Untitled Page'}</h4>
                              <p className="text-[9px] text-white/40 font-mono truncate">{result.data[0]?.url || 'Unknown Source'}</p>
                           </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                           <span className="text-[10px] font-black text-primary italic uppercase">{result.pages_scraped} Nodes</span>
                           <div className="w-[1px] h-3 bg-white/10" />
                           <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">PROMOTED</div>
                        </div>
                      </div>

                      <div className="p-6">
                        <AnimatePresence mode="wait">
                          {viewMode === 'content' && (
                            <motion.div
                              key="content"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="space-y-6"
                            >
                              <div className="flex gap-4">
                                 <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1 flex-1">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                       <Clock size={10} /> Reading Time
                                    </div>
                                    <div className="text-sm font-black text-white">{result.data[0]?.metadata?.reading_time_min || '1'} MIN</div>
                                 </div>
                                 <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1 flex-1">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                       <Hash size={10} /> Word Count
                                    </div>
                                    <div className="text-sm font-black text-white">{result.data[0]?.metadata?.word_count || '250'} WORDS</div>
                                 </div>
                              </div>
                              
                              <div className="prose prose-invert max-w-none text-xs text-white/60 leading-relaxed font-medium">
                                {result.data[0]?.text && result.data[0].text.length > 500 
                                  ? result.data[0].text.substring(0, 500) + '...' 
                                  : result.data[0]?.text || 'No text content extracted.'}
                              </div>

                              <div className="space-y-3 pt-4 border-t border-white/5">
                                 <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Discovered Relations</label>
                                 <div className="flex flex-wrap gap-2">
                                    {result.data[0]?.links?.slice(0, 6).map(link => (
                                      <div key={link} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[9px] font-bold text-white/60 flex items-center gap-2 hover:bg-primary/10 hover:border-primary/20 transition-all cursor-default group">
                                         <ChevronRight size={10} className="text-white/20 group-hover:text-primary transition-colors" />
                                         {link}
                                      </div>
                                    ))}
                                 </div>
                              </div>
                            </motion.div>
                          )}

                          {viewMode === 'meta' && (
                            <motion.div
                              key="meta"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                               {Object.entries(result.data[0]?.metadata || {}).map(([key, val]) => (
                                 key !== 'images' && (
                                   <div key={key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                      <label className="text-[9px] font-black uppercase tracking-widest text-primary shrink-0">{key.replace(/_/g, ' ')}</label>
                                      <div className="text-[11px] font-mono text-white/80 break-all">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</div>
                                   </div>
                                 )
                               ))}
                               {result.data[0]?.metadata?.images && (
                                  <div className="md:col-span-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                     <label className="text-[9px] font-black uppercase tracking-widest text-primary">Visual Identity Matrix</label>
                                     <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                                        {(result.data[0].metadata.images as string[]).map((img, i) => (
                                          <div key={i} className="shrink-0 w-20 h-14 rounded-xl bg-white/10 border border-white/10 overflow-hidden relative group">
                                             <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                          </div>
                                        ))}
                                     </div>
                                  </div>
                               )}
                            </motion.div>
                          )}

                          {viewMode === 'json' && (
                            <motion.div
                              key="json"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="rounded-2xl bg-zinc-950 p-6 border border-white/5 font-mono text-[10px] text-blue-400 overflow-x-auto"
                            >
                               <pre className="no-scrollbar">
                                  {JSON.stringify(result, null, 2)}
                               </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center space-y-3">
                       <AlertCircle className="mx-auto text-red-500/50" size={32} />
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No data nodes discovered</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : !isScraping && (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/60 rounded-[32px] opacity-40 space-y-4">
                   <Layers size={48} className="text-muted-foreground/30" />
                   <p className="text-[11px] font-bold uppercase tracking-widest text-center">Results will be visualized here<br/>after intelligence extraction</p>
                </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
