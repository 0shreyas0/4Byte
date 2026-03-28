"use client";

import { motion } from "framer-motion";
import { PlusCircle, Search, Box, Zap } from "lucide-react";
import { Card } from "@/ui";

export function Workflow() {
  return (
    <section className="mb-48 text-center max-w-5xl mx-auto py-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-16"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-heading">Built for Developer Velocity</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">The fastest way to go from idea to a production-scale application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-primary/30 to-transparent z-0"></div>
          
          {[
            { icon: <PlusCircle size={24} />, title: "Create Project", color: "bg-info/20 text-info", desc: "Run create-hackkit-app to generate a Next.js project preconfigured for HackKit." },
            { icon: <Search size={24} />, title: "Search Modules", color: "bg-primary/20 text-primary", desc: "Browse a global registry of modules, from authentication to complex AI workflows." },
            { icon: <Box size={24} />, title: "Add Features", color: "bg-warning/20 text-warning", desc: "CLI pulls raw source code into your /src folder. You own the code." },
            { icon: <Zap size={24} />, title: "Deploy Fast", color: "bg-success/20 text-success", desc: "Pre-configured CI/CD pipelines for Vercel, Railway, and AWS." }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <Card className="p-6 bg-card border-border hover:shadow-lg transition-all rounded-3xl h-full flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h4 className="text-lg font-heading mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground font-body">{step.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
