"use client";

import { Card } from "@/components/ui";
import { Image, Video, Mic, FileText, ShieldAlert, Fingerprint, Globe, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const problems = [
    {
        icon: ShieldAlert,
        title: "Fake News",
        desc: "Propaganda and misinformation spreading through generated content."
    },
    {
        icon: UserCheck,
        title: "Identity Fraud",
        desc: "Unauthorized use of likeness in financial and personal scams."
    },
    {
        icon: Globe,
        title: "Political Manipulation",
        desc: "Interference in democratic processes through synthetic media."
    },
    {
        icon: Fingerprint,
        title: "Loss of Trust",
        desc: "Erosion of belief in authentic digital evidence and communication."
    }
];

const capabilities = [
    {
        icon: Image,
        type: "Image",
        desc: "Detect GAN, Diffusion models, and face-swaps in high resolution images."
    },
    {
        icon: Video,
        type: "Video",
        desc: "Analyze frame-by-frame for temporal inconsistencies and artifacts."
    },
    {
        icon: Mic,
        type: "Audio",
        desc: "Identify synthetic voice clones and frequency spectrum anomalies."
    },
    {
        icon: FileText,
        type: "Text",
        desc: "Verify authorship and detect AI-hallucinated or generated text."
    }
];

export function FeatureGrid() {
    return (
        <section className="py-32 space-y-48 relative z-10">
            {/* Problem Section */}
            <div id="features" className="max-w-7xl mx-auto px-6 w-full pt-20">
                <div className="mb-16">
                    <span className="font-ibm-plex-mono text-accent-cyan text-sm uppercase tracking-widest mb-4 inline-block">
                        THE PROBLEM
                    </span>
                    <h2 className="font-syne text-4xl font-bold text-white max-w-xl">
                        Deepfakes are spreading faster than truth.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Card className="h-full group">
                                <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-colors">
                                    <p.icon className="w-6 h-6 text-accent-cyan" />
                                </div>
                                <h3 className="font-dm-sans font-semibold text-lg text-white mb-3">{p.title}</h3>
                                <p className="font-dm-sans text-sm text-text-secondary leading-relaxed">{p.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Capabilities Section */}
            <div className="max-w-7xl mx-auto px-6 w-full pt-16">
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
                    <h2 className="font-syne text-4xl md:text-5xl font-bold text-white tracking-tight">
                        One platform. Four threat surfaces.
                    </h2>
                    <p className="font-dm-sans text-text-secondary">
                        DeepScan implements specialized AI kernels tailored for each media modality, ensuring
                        high-precision forensic integrity across the digital landscape.
                    </p>
                </div>

                <div className="space-y-40">
                    {capabilities.map((c, i) => (
                        <motion.div
                            key={c.type}
                            className={cn(
                                "flex flex-col md:flex-row items-center gap-12 md:gap-24",
                                i % 2 !== 0 ? "md:flex-row-reverse text-left md:text-right" : "text-left"
                            )}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className={cn(
                                "flex-1 space-y-8 w-full",
                                i % 2 !== 0 ? "md:items-end md:text-right" : "md:items-start md:text-left",
                                "flex flex-col items-center text-center"
                            )}>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.1)]">
                                    <c.icon className="w-8 h-8 text-accent-cyan" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-syne text-3xl md:text-4xl font-bold text-white">{c.type} Detection</h3>
                                    <p className="font-dm-sans text-lg text-text-secondary leading-relaxed">{c.desc}</p>
                                </div>
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 w-fit">
                                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#00D4FF]" />
                                    <span className="font-ibm-plex-mono text-[10px] text-text-primary uppercase tracking-widest">Confidence Output Enabled</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full aspect-[4/3] max-w-xl bg-bg-secondary rounded-3xl border border-border-subtle overflow-hidden relative group shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-accent-blue/10 pointer-events-none" />
                                <div className="absolute inset-0 noise-overlay opacity-20" />

                                {/* Mock Visual Component */}
                                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                                    <div className="w-full h-full border border-accent-cyan/20 rounded-2xl bg-bg-primary/50 backdrop-blur-sm flex flex-col p-6 space-y-6 relative overflow-hidden">
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-status-fake" />
                                                <div className="w-3 h-3 rounded-full bg-status-warning" />
                                                <div className="w-3 h-3 rounded-full bg-status-real" />
                                            </div>
                                            <div className="font-ibm-plex-mono text-[10px] text-accent-cyan uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
                                                Live Scanning...
                                            </div>
                                        </div>

                                        <div className="flex-1 bg-white/5 rounded-xl border border-white/5 overflow-hidden relative flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                            <c.icon className="w-16 h-16 text-white/5 absolute transition-transform group-hover:scale-110 duration-500" />
                                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent shadow-[0_0_20px_rgba(0,212,255,0.8)] absolute top-0 animate-[scan_3s_linear_infinite]" />

                                            {/* Simulated Data Points */}
                                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                                <div className="absolute top-10 left-10 w-20 h-px bg-accent-cyan" />
                                                <div className="absolute bottom-20 right-10 w-px h-20 bg-accent-cyan" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 relative z-10">
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-cyan w-3/4 animate-pulse" />
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-blue w-1/2 animate-pulse delay-75" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { transform: translateY(280px); opacity: 0; }
                }
            `}</style>
        </section>
    );
}
