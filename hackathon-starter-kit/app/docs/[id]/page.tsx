'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { COMPONENT_REGISTRY, ModularFile } from '@/lib/registry';
import { ModularView } from '../ModularView';
import { ComponentPreview } from '../ComponentPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code2, Play, HelpCircle, BookOpen, Table2, Terminal } from 'lucide-react';
import Link from 'next/link';
import { getFileContent } from '../actions';
import { CodeSnippet } from '@/ui/components/CodeSnippet';
import { useAuth } from '@/lib/hooks/useAuth';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export default function ComponentPage() {
  const params = useParams();
  const id = params.id as string;
  const component = COMPONENT_REGISTRY.find(c => c.id === id);

  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const defaultFile = component?.modularStructure.find(f => f.name === 'index.tsx' || f.name === 'index.ts' || f.type === 'file') || component?.modularStructure[0];
  const [selectedFile, setSelectedFile] = useState<ModularFile | undefined>(defaultFile);
  const [fileContent, setFileContent] = useState<string>('');
  const [isCodeLoading, setIsCodeLoading] = useState(false);

  const isRealtime = component?.category === 'Real-Time';
  const isAuthorized = !isRealtime || !!user;

  useEffect(() => {
    if (isRealtime && !user && !authLoading) {
      toast.error('Authentication Required', {
        description: 'You need to be logged in to access Real-Time features.'
      });
    }
  }, [isRealtime, user, authLoading]);

  useEffect(() => {
    if (component && selectedFile && selectedFile.type === 'file') {
      setIsCodeLoading(true);
      getFileContent(component.name, selectedFile.path)
        .then(content => setFileContent(content))
        .finally(() => setIsCodeLoading(false));
    } else {
      setFileContent(`// Code snippets are only available for files.\n// You selected a directory: ${selectedFile?.path || 'unknown'}`);
    }
  }, [component, selectedFile]);

  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1 className="text-h2 font-heading">Component not found</h1>
        <Link href="/docs" className="text-primary hover:underline">Return to Library</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* ── Header ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/docs" className="hover:text-primary transition-colors">Library</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{component.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 min-w-0 flex-1">
            <h1 className="text-h2 md:text-h1 font-heading tracking-tighter flex flex-wrap items-center gap-3 leading-[0.9]">
              <component.icon className="text-primary shrink-0" size={32} />
              <span>{component.name}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {component.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start md:self-end pb-1">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
              component.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
              component.difficulty === 'Modular' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
              'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
              {component.difficulty} Build
            </span>
          </div>
        </div>
      </div>

      {/* ── Two-column: Preview + Architecture ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — Interactive Preview / Code */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
              <motion.div
                key="preview-wrapper"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-background border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/5"
              >
                <div className="px-6 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Interactive Preview
                  </span>
                </div>
                <div className="min-h-[400px] w-full flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat relative">
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <ComponentPreview id={id} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code-wrapper"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {isCodeLoading ? (
                  <div className="w-full min-h-[400px] flex items-center justify-center p-8 text-muted-foreground bg-background border border-border rounded-3xl">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
                    Loading...
                  </div>
                ) : (
                  <CodeSnippet
                    code={fileContent}
                    language={selectedFile?.name.endsWith('.ts') ? 'typescript' : 'tsx'}
                    className="max-h-[600px] shadow-2xl"
                    windowVariant="mac"
                    title={selectedFile?.name || 'Selected File'}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Architecture + View Code button */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">Architecture</h3>
            <ModularView
              component={component}
              selectedFile={selectedFile}
              onSelectFile={(file) => {
                setSelectedFile(file);
                setActiveTab('code');
              }}
            />
          </div>

          {/* View Code Snippets — moved here from below */}
          <button
            onClick={() => setActiveTab(activeTab === 'preview' ? 'code' : 'preview')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-secondary text-foreground hover:bg-muted transition-colors font-action text-sm border border-border/50"
          >
            {activeTab === 'preview' ? (
              <><Code2 size={15} /> View Code Snippets</>
            ) : (
              <><Play size={15} /> Back to Preview</>
            )}
          </button>
        </div>
      </div>

      {/* ── Props Table ── */}
      {component.props && component.props.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 pt-4 border-t border-border"
        >
          <div className="flex items-center gap-2">
            <Table2 size={18} className="text-primary" />
            <h2 className="text-lg font-heading tracking-tight">Prop Usage</h2>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground w-1/5">Prop</th>
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground w-1/4">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground w-1/6">Default</th>
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {component.props.map((prop, i) => (
                  <tr key={prop.name} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-1.5">
                        <code className="text-primary font-bold font-mono text-xs">{prop.name}</code>
                        {prop.required && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
                            required
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{prop.type}</code>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {prop.default ? (
                        <code className="text-xs font-mono text-foreground/70">{prop.default}</code>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground text-xs leading-relaxed">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ── Usage ── */}
      {component.usage && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4 pt-4 border-t border-border"
        >
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-primary" />
            <h2 className="text-lg font-heading tracking-tight">Usage</h2>
          </div>
          <CodeSnippet
            code={component.usage}
            language="tsx"
            className="rounded-2xl border border-border/50"
          />
        </motion.div>
      )}

      {/* ── Scraper-specific setup guide ── */}
      {id === 'scraper-service' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-12 border-t border-border space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
              <HelpCircle className="text-primary" size={24} />
              Technical Setup Guide
            </h2>
            <p className="text-muted-foreground">Follow these steps to initialize the Python scraping engine on your local machine.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">01</div>
                <h3 className="text-xs font-black uppercase tracking-widest">Environment</h3>
              </div>
              <CodeSnippet code={`cd scraper-service\npython3 -m venv venv\nsource venv/bin/activate`} language="bash" className="rounded-[24px] border border-border/50 bg-secondary/30" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">02</div>
                <h3 className="text-xs font-black uppercase tracking-widest">Dependencies</h3>
              </div>
              <CodeSnippet code={`pip install -r requirements.txt`} language="bash" className="rounded-[24px] border border-border/50 bg-secondary/30" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">03</div>
                <h3 className="text-xs font-black uppercase tracking-widest">Launch Node</h3>
              </div>
              <CodeSnippet code={`python api/main.py`} language="bash" className="rounded-[24px] border border-border/50 bg-secondary/30" />
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 flex items-start gap-4">
            <BookOpen className="text-primary mt-1 shrink-0" size={20} />
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">Pre-configured Handshake</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The frontend Scraper component is already mapped to <code className="text-foreground font-bold">localhost:8000</code>. Once your local node is active, use the interactive preview above to trigger real-world extractions and modular data ingestion logs.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
