"use client";

import { motion } from "framer-motion";
import { Github, Mail, ExternalLink } from "lucide-react";
import { Card } from "@/ui";
import Link from "next/link";

interface ContactCardProps {
  name: string;
  github: string;
  email: string;
  avatar?: string;
}

export function ContactCard({ name, github, email, avatar }: ContactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="p-8 h-full flex flex-col items-center text-center bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all group relative overflow-hidden">
        {/* Background gradient effect on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Avatar Placeholder */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border-2 border-border group-hover:border-primary/50 transition-colors overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl font-heading text-muted-foreground">{name.charAt(0)}</div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center scale-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
            <ExternalLink size={12} className="text-primary-foreground" />
          </div>
        </div>

        <h3 className="text-2xl font-heading mb-2 text-foreground">{name}</h3>
        <p className="text-muted-foreground text-sm font-body mb-6 max-w-[200px]">Project Creator & Developer</p>

        <div className="flex gap-4 mt-auto">
          <Link
            href={github}
            target="_blank"
            className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-all"
            title="GitHub Profile"
          >
            <Github size={20} />
          </Link>
          <Link
            href={`mailto:${email}`}
            className="p-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-all"
            title="Send Email"
          >
            <Mail size={20} />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
