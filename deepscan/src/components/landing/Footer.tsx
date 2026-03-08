"use client";

import { Shield, Server, Box, Cpu, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    { icon: Shield, label: "Upload", desc: "Select media for analysis" },
    { icon: Server, label: "FastAPI", desc: "Route to specialized models" },
    { icon: Box, label: "Process", desc: "Frame/Frequency extraction" },
    { icon: Cpu, label: "AI Model", desc: "Inference & validation" },
    { icon: FileCheck, label: "Result", desc: "Final verdict & score" },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-bg-secondary/30 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-syne text-4xl font-bold text-white mb-20 text-center">
                    Engineered for Media Forensic Integrity
                </h2>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent hidden lg:block" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.label}
                                className="flex flex-col items-center text-center space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center relative z-10 group-hover:border-accent-cyan transition-colors">
                                        <step.icon className="w-6 h-6 text-accent-cyan" />
                                    </div>
                                    <div className="absolute -inset-2 bg-accent-cyan/5 blur-xl rounded-full -z-0" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center text-[10px] font-ibm-plex-mono text-text-muted">
                                        0{i + 1}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-syne font-semibold text-white uppercase tracking-wider">{step.label}</h3>
                                    <p className="font-dm-sans text-xs text-text-secondary leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="py-20 border-t border-border-subtle bg-bg-primary">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-6 max-w-sm text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                            <Shield className="w-5 h-5 text-bg-primary" />
                        </div>
                        <span className="font-syne font-bold text-2xl tracking-tight text-white">
                            DeepScan
                            <span className="text-accent-cyan">.</span>
                        </span>
                    </div>
                    <p className="font-dm-sans text-sm text-text-secondary">
                        Advanced multi-modal AI detection platform built for journalists, fact-checkers, and cybersecurity professionals.
                    </p>
                    <p className="font-ibm-plex-mono text-[10px] text-text-muted uppercase tracking-widest">
                        Built for Hackathon Innovation 2026
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    {["Next.js 14", "Tailwind CSS", "FastAPI", "PyTorch"].map((tech) => (
                        <div key={tech} className="px-4 py-1.5 rounded-full border border-border-subtle bg-white/5 font-ibm-plex-mono text-[10px] text-text-secondary uppercase tracking-widest">
                            {tech}
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-[0.2em]">
                    &copy; 2026 DEEPSCAN PROTOCOL. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
}
