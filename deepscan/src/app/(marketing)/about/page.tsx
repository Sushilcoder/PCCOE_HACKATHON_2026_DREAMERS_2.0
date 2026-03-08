"use client";

import { Card, Badge } from "@/components/ui";
import {
    Users,
    Layers,
    Workflow,
    Cpu,
    Globe,
    Database,
    ShieldCheck,
    Zap,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const techStack = [
    { category: "Frontend", items: ["Next.js 14", "Tailwind CSS", "Framer Motion", "Lucide Icons"] },
    { category: "Backend / AI", items: ["FastAPI", "PyTorch", "TensorFlow", "Transformers"] },
    { category: "Infrastructure", items: ["AWS Lambda", "Redis", "Docker", "PostgreSQL"] },
];

const team = [
    { name: "Alex Rivera", role: "AI Research Lead", description: "Specializes in gan-forensics and deepfake detection models." },
    { name: "Sarah Chen", role: "Fullstack Architect", description: "Focused on high-performance inference scaling and system design." },
    { name: "Marcus Thorne", role: "Security Analyst", description: "Cybersecurity expert with focus on digital evidence integrity." },
];

export default function AboutPage() {
    return (
        <div className="bg-bg-primary min-h-screen">
            {/* Simple Navbar for About Page */}
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-border-subtle">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                        <Layers className="w-5 h-5 text-bg-primary" />
                    </div>
                    <span className="font-syne font-bold text-xl tracking-tight text-white">DeepScan <span className="text-accent-cyan">/</span > Architecture</span>
                </div>
                <a href="/dashboard" className="text-sm font-dm-sans text-text-secondary hover:text-white transition-colors">Back to Dashboard</a>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16 space-y-24 w-full">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <Badge variant="real" className="bg-accent-blue/10 text-accent-blue border-accent-blue/20">System Integrity</Badge>
                    <h1 className="font-syne text-5xl font-bold text-white leading-tight">Forensic Intelligence Platform</h1>
                    <p className="font-dm-sans text-lg text-text-secondary max-w-2xl mx-auto">
                        DeepScan is engineered to provide military-grade media verification through a distributed AI architecture.
                    </p>
                </section>

                {/* Architecture Diagram */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Workflow className="w-5 h-5 text-accent-cyan" />
                        <h2 className="font-syne text-2xl font-bold text-white">System Flow Architecture</h2>
                    </div>

                    <Card className="p-12 bg-bg-secondary/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent pointer-events-none" />

                        {/* SVG Flowchart */}
                        <div className="relative z-10">
                            <svg viewBox="0 0 800 200" className="w-full h-auto">
                                {/* Definitions for arrowheads */}
                                <defs>
                                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                        <path d="M0,0 L0,6 L9,3 z" fill="#1E2A45" />
                                    </marker>
                                </defs>

                                {/* Nodes */}
                                <g className="nodes">
                                    {/* User/Frontend */}
                                    <rect x="20" y="70" width="120" height="60" rx="8" fill="#141B2D" stroke="#1E2A45" strokeWidth="1" />
                                    <text x="80" y="105" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontFamily="DM Sans">Frontend (Next.js)</text>

                                    {/* API */}
                                    <rect x="220" y="70" width="120" height="60" rx="8" fill="#141B2D" stroke="#00D4FF" strokeWidth="1" />
                                    <text x="280" y="105" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontFamily="DM Sans">FastAPI Gateway</text>

                                    {/* AI Models */}
                                    <g transform="translate(420, 20)">
                                        <rect width="140" height="160" rx="12" fill="#0A0E1A" stroke="#1E2A45" strokeWidth="1" strokeDasharray="4 4" />
                                        <text x="70" y="-10" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="IBM Plex Mono" style={{ textTransform: 'uppercase' }}>Model Inference Cluster</text>

                                        <rect x="10" y="15" width="120" height="30" rx="4" fill="#141B2D" stroke="#1E2A45" strokeWidth="1" />
                                        <text x="70" y="34" textAnchor="middle" fill="#00D4FF" fontSize="9" fontFamily="IBM Plex Mono">IMG-DETECTION-V4</text>

                                        <rect x="10" y="50" width="120" height="30" rx="4" fill="#141B2D" stroke="#1E2A45" strokeWidth="1" />
                                        <text x="70" y="69" textAnchor="middle" fill="#00D4FF" fontSize="9" fontFamily="IBM Plex Mono">VID-ANALYSIS-X</text>

                                        <rect x="10" y="85" width="120" height="30" rx="4" fill="#141B2D" stroke="#1E2A45" strokeWidth="1" />
                                        <text x="70" y="104" textAnchor="middle" fill="#00D4FF" fontSize="9" fontFamily="IBM Plex Mono">AUD-SPECTRUM-Z</text>

                                        <rect x="10" y="120" width="120" height="30" rx="4" fill="#141B2D" stroke="#1E2A45" strokeWidth="1" />
                                        <text x="70" y="139" textAnchor="middle" fill="#00D4FF" fontSize="9" fontFamily="IBM Plex Mono">TXT-VERIFY-LLM</text>
                                    </g>

                                    {/* Database/Result */}
                                    <rect x="640" y="70" width="120" height="60" rx="8" fill="#141B2D" stroke="#10B981" strokeWidth="1" />
                                    <text x="700" y="105" textAnchor="middle" fill="#F1F5F9" fontSize="12" fontFamily="DM Sans">Forensic Audit DB</text>
                                </g>

                                {/* Connections */}
                                <g className="links" stroke="#1E2A45" strokeWidth="1.5" fill="none">
                                    <path d="M140,100 L220,100" markerEnd="url(#arrow)" />
                                    <path d="M340,100 L420,100" markerEnd="url(#arrow)" />
                                    <path d="M560,100 L640,100" markerEnd="url(#arrow)" />
                                </g>
                            </svg>
                        </div>
                    </Card>
                </section>

                {/* Tech Stack */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-accent-cyan" />
                        <h2 className="font-syne text-2xl font-bold text-white">Technological Infrastructure</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {techStack.map((stack) => (
                            <Card key={stack.category} className="space-y-6">
                                <h3 className="font-syne font-bold text-text-primary uppercase tracking-widest text-sm">{stack.category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {stack.items.map(item => (
                                        <div key={item} className="px-3 py-1.5 rounded-lg bg-bg-surface border border-border-subtle font-ibm-plex-mono text-[10px] text-accent-cyan">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-accent-cyan" />
                        <h2 className="font-syne text-2xl font-bold text-white">Project Leadership</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <Card key={member.name} className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan/10 to-accent-blue/10 border border-border-subtle flex items-center justify-center">
                                    <Users className="w-8 h-8 text-accent-cyan" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-syne font-bold text-lg text-white">{member.name}</h4>
                                    <Badge variant="real" className="bg-transparent border-white/10 text-accent-blue">{member.role}</Badge>
                                </div>
                                <p className="font-dm-sans text-xs text-text-secondary leading-relaxed">
                                    {member.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Roadmap */}
                <section className="space-y-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-accent-cyan" />
                            <h2 className="font-syne text-2xl font-bold text-white">Forensic Roadmap</h2>
                        </div>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-border-subtle">
                        {[
                            { label: "Q2 2026", title: "Real-time Video Stream Interception", status: "In Development" },
                            { label: "Q3 2026", title: "Blockchain Media Provenance Integration", status: "Planning" },
                            { label: "Q4 2026", title: "Browser Forensic Extension Launch", status: "Upcoming" },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-8 relative">
                                <div className="w-6 h-6 rounded-full bg-bg-primary border-2 border-accent-cyan flex items-center justify-center relative z-10 shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                                </div>
                                <div className="space-y-2 pb-8">
                                    <div className="flex items-center gap-3">
                                        <span className="font-ibm-plex-mono text-[10px] text-accent-cyan uppercase tracking-widest">{item.label}</span>
                                        <span className="text-[10px] text-text-muted">•</span>
                                        <span className={`text-[10px] font-dm-sans ${item.status === 'In Development' ? 'text-status-warning' : 'text-text-muted'}`}>{item.status}</span>
                                    </div>
                                    <h4 className="font-syne font-bold text-text-primary">{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="py-20 border-t border-border-subtle text-center">
                <p className="font-ibm-plex-mono text-xs text-text-muted uppercase tracking-[0.3em]">DeepScan Protocol Security Stack</p>
            </div>
        </div>
    );
}
