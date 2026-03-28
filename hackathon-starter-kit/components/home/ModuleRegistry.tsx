"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Shield, Cpu, ChevronRight } from "lucide-react";
import { Card, Button } from "@/ui";

const modules = [
  { id: 'team-chat', name: 'Real-time Chat', desc: 'Secure, websocket-based team messaging with file sharing.', icon: <MessageSquare size={24} />, category: 'Communication' },
  { id: 'auth-clerk', name: 'Auth Registry', desc: 'Pre-configured Clerk authentication with custom profile flows.', icon: <Users size={24} />, category: 'Security' },
  { id: 'safe-vault', name: 'Safe Vault', desc: 'Encrypted storage module for sensitive developer credentials.', icon: <Shield size={24} />, category: 'Security' },
  { id: 'agent-link', name: 'AI Connect', desc: 'A streaming LLM interface with support for multiple providers.', icon: <Cpu size={24} />, category: 'AI Tools' },
];

export function ModuleRegistry() {
  return (
    <section className="mb-48">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl font-heading">Powerful Modules</h2>
        <p className="text-muted-foreground font-body">Production-grade features, source-code included.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 h-full flex flex-col bg-card/30 border-border hover:border-primary/50 transition-all group rounded-3xl">
              <div className="mb-6 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {module.icon}
              </div>
              <h4 className="text-xl font-heading mb-2">{module.name}</h4>
              <p className="text-sm text-muted-foreground mb-6 grow font-body">{module.desc}</p>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-secondary border border-border font-mono text-xs text-muted-foreground">
                  npx hackkit add {module.id}
                </div>
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground group-hover:text-primary p-0 h-auto font-action flex gap-2">
                   Explore Module <ChevronRight size={14} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
