"use client";

import { useState, useRef } from "react";
import { Hero } from "@/components/home/Hero";
import { CLITerminal } from "@/components/home/CLITerminal";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { Workflow } from "@/components/home/Workflow";
import { CommandCenter } from "@/components/home/CommandCenter";
import { ModuleRegistry } from "@/components/home/ModuleRegistry";
import { ArchitectureDiagram } from "@/components/home/ArchitectureDiagram";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [isAIHubOpen, setIsAIHubOpen] = useState(false);
  const terminalRef = useRef<HTMLElement>(null);

  const onCopy = () => {
    navigator.clipboard.writeText("npx create-hackkit-app@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTerminal = () => {
    terminalRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden font-body selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[5%] w-160 h-160 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-120 h-120 bg-primary/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <Hero scrollToTerminal={scrollToTerminal} />
        <CLITerminal copied={copied} onCopy={onCopy} terminalRef={terminalRef} />
        <FeatureShowcase isAIHubOpen={isAIHubOpen} setIsAIHubOpen={setIsAIHubOpen} />
        <Workflow />
        <CommandCenter />
        <ModuleRegistry />
        <ArchitectureDiagram />
        <CTA scrollToTerminal={scrollToTerminal} />
      </div>
    </main>
  );
}
