"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";
import { ContactCard } from "@/components/ContactCard";

const teamMembers = [
  {
    name: "Pruthviraj Kachate",
    github: "https://github.com/Pruthv-creates",
    email: "pruthvirajkachate2005@gmail.com",
    avatar: "https://github.com/Pruthv-creates.png"
  },
  {
    name: "Shreyas Mukadam",
    github: "https://github.com/0shreyas0",
    email: "githubshreyas@gmail.com",
    avatar: "https://github.com/0shreyas0.png"
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center py-20 relative px-4 sm:px-6 lg:px-8">
      {/* Background Orbs - Matching landing page style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-200 h-200 bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-160 h-160 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative w-full">
        {/* Navigation Breadcrumb - Minimalist style since the main Navbar is present */}
        <div className="flex items-center justify-start mb-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="p-2 rounded-full bg-secondary group-hover:bg-accent transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-action text-sm">Return Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-2xs font-action mb-4 uppercase tracking-widest">
              The Collective
            </span>
            <h1 className="text-5xl md:text-7xl font-heading tracking-tighter mb-6 bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              Contact the Creators
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-body leading-relaxed">
              Meet the minds behind HackKit. We're building the future of rapid hackathon development, one module at a time.
            </p>
          </motion.div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-32">
          {teamMembers.map((member) => (
            <ContactCard
              key={member.name}
              {...member}
            />
          ))}
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 -z-20 opacity-30 pointer-events-none mask-[radial-gradient(ellipse_at_center,black_70%,transparent_100%)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[40px_40px]"></div>
        </div>
      </div>
    </main>
  );
}
