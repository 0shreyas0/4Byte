"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Layout, CreditCard, Sparkles, X } from "lucide-react";
import { Button, Card, RazorpayButton, AIChat } from "@/ui";

interface FeatureShowcaseProps {
  isAIHubOpen: boolean;
  setIsAIHubOpen: (open: boolean) => void;
}

export function FeatureShowcase({ isAIHubOpen, setIsAIHubOpen }: FeatureShowcaseProps) {
  return (
    <section className="mb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {!isAIHubOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
            <Card className="p-8 space-y-5 bg-card/30 backdrop-blur-sm border-border hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Layout size={24} />
              </div>
              <h3 className="text-2xl font-heading">UI Components</h3>
              <p className="text-muted-foreground font-body">Atomic components like buttons, inputs, and modals with smooth animations designed for speed.</p>
              <div className="flex flex-wrap gap-2 pt-4">
                <Button size="sm" className="rounded-lg font-action">Primary</Button>
                <Button variant="outline" size="sm" className="rounded-lg">Secondary</Button>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div 
          layout
          className={`transition-all duration-700 ease-in-out ${isAIHubOpen ? 'md:col-span-3' : 'md:col-span-1'}`}
        >
          <Card 
            className={`p-8 bg-card/30 border-border transition-all ${isAIHubOpen ? 'shadow-2xl border-primary/40 bg-background/50 backdrop-blur-md' : 'shadow-xl cursor-pointer hover:border-primary/40 hover:-translate-y-1'}`}
            onClick={!isAIHubOpen ? () => setIsAIHubOpen(true) : undefined}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-heading">AI Agent Hub</h3>
                <p className="text-muted-foreground font-body">Automated agents for research, extraction, and synthesis. Integrated seamlessly with the CLI.</p>
              </div>
              {isAIHubOpen && (
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsAIHubOpen(false); }} className="p-2 h-10 w-10 rounded-full hover:bg-secondary shrink-0">
                  <X size={20} />
                </Button>
              )}
            </div>
            
            {!isAIHubOpen && (
              <div className="pt-6">
                <Button size="sm" variant="outline" className="rounded-xl w-full border-primary/20 text-primary hover:bg-primary/10 font-bold">
                  Launch AI Hub Preview
                </Button>
              </div>
            )}

            <AnimatePresence>
              {isAIHubOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-10"
                >
                  <AIChat />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {!isAIHubOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            <Card className="p-8 space-y-5 bg-card/30 backdrop-blur-sm border-border hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <h3 className="text-2xl font-heading">Global Payments</h3>
              <p className="text-muted-foreground font-body">Secure Razorpay integration for international and local payments. Source code available via CLI.</p>
              <div className="pt-4">
                <RazorpayButton amount={499} name="Purchase Kit" />
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
