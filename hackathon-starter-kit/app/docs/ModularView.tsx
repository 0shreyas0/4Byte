'use client';

import React, { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { ComponentMetadata, ModularFile } from '@/lib/registry';
import { getDirectoryContent } from './actions';

interface ModularViewProps {
  component: ComponentMetadata;
  selectedFile?: ModularFile;
  onSelectFile?: (file: ModularFile) => void;
}

export const ModularView: React.FC<ModularViewProps> = ({ component, selectedFile, onSelectFile }) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [dirContents, setDirContents] = useState<Record<string, ModularFile[]>>({});
  const [loadingDirs, setLoadingDirs] = useState<Set<string>>(new Set());

  const handleToggleDir = async (dir: ModularFile) => {
    const isExpanded = expandedDirs.has(dir.path);
    const newExpanded = new Set(expandedDirs);

    if (isExpanded) {
      newExpanded.delete(dir.path);
      setExpandedDirs(newExpanded);
    } else {
      newExpanded.add(dir.path);
      setExpandedDirs(newExpanded);

      if (!dirContents[dir.path]) {
        setLoadingDirs(prev => new Set(prev).add(dir.path));
        const contents = await getDirectoryContent(component.name, dir.path);
        setDirContents(prev => ({ ...prev, [dir.path]: contents }));
        setLoadingDirs(prev => {
          const next = new Set(prev);
          next.delete(dir.path);
          return next;
        });
      }
    }
  };

  const renderFile = (item: ModularFile, depth: number = 0) => {
    const isSelected = selectedFile?.path === item.path;
    const isDir = item.type === 'directory';
    const isExpanded = expandedDirs.has(item.path);
    const isLoading = loadingDirs.has(item.path);

    return (
      <React.Fragment key={item.path}>
        <button 
          onClick={() => {
            if (isDir) {
              handleToggleDir(item);
            } else {
              onSelectFile?.(item);
            }
          }}
          className={`w-full text-left flex items-center gap-2 py-1 px-2 rounded transition-colors group/file ${
            isSelected && !isDir ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isDir ? (
            <div className="flex items-center gap-1 shrink-0">
              {isExpanded ? <ChevronDown size={12} className="opacity-50" /> : <ChevronRight size={12} className="opacity-50" />}
              <Folder size={14} className={isExpanded ? 'text-primary text-primary-glow' : 'text-primary/70'} />
            </div>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
               <span className="w-3" /> {/* Spacer for alignment */}
               <File size={14} className={isSelected ? 'text-primary' : 'text-muted-foreground/60'} />
            </div>
          )}
          
          <span className={`truncate ${item.name.endsWith('.tsx') || item.name.endsWith('.ts') ? (isSelected ? 'font-bold' : 'text-blue-400/80') : (isSelected ? 'font-bold' : '')}`}>
            {item.name}
          </span>
          
          {isLoading && <span className="w-3 h-3 rounded-full border border-primary border-t-transparent animate-spin ml-2 shrink-0" />}

          {(item.name === 'index.tsx' || item.name === 'index.ts') && !isSelected && !isDir && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-black tracking-tighter ml-auto opacity-0 group-hover/file:opacity-100 transition-opacity shrink-0">Entry</span>
          )}
          {isSelected && !isDir && (
             <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-black tracking-tighter ml-auto shrink-0">Viewing</span>
          )}
        </button>

        {isDir && isExpanded && dirContents[item.path] && (
          <div className="flex flex-col relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border/50" style={{ left: `${depth * 16 + 18}px` }} />
            {dirContents[item.path].map(child => renderFile(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-muted/10 border border-border rounded-2xl p-6 relative overflow-hidden group">

      <div className="space-y-1 font-mono text-sm relative z-10">
        <div className="flex items-center gap-2 text-primary font-bold mb-2">
          <Folder size={16} />
          {component.name}/
        </div>
        
        <div className="relative pl-2 space-y-1 border-l border-border/50 ml-2 py-1">
          {component.modularStructure.map((item) => renderFile(item, 0))}
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
    </div>
  );
};
