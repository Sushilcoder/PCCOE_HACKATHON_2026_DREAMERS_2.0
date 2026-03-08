"use client";

import { useState } from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { DetectionInterface } from "@/components/dashboard/DetectionInterface";
import { ResultPanel } from "@/components/dashboard/ResultPanel";
import { RecentScansTable } from "@/components/dashboard/RecentScansTable";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const [result, setResult] = useState<any>(null);

    return (
        <div className="space-y-16 py-4">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-bg-secondary border border-border-subtle p-8 md:p-12 min-h-[320px] lg:min-h-[400px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-cyan/5 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
                        <span className="text-[10px] font-ibm-plex-mono text-accent-cyan uppercase tracking-widest">Active Investigation</span>
                    </div>
                    <h1 className="font-syne text-4xl md:text-5xl font-bold text-white leading-tight">
                        Security Control & <br /> Forensic Analysis
                    </h1>
                    <p className="font-dm-sans text-text-secondary text-lg leading-relaxed">
                        Monitor real-time media ingestion and execute high-precision AI detection
                        across four media threat surfaces concurrently.
                    </p>
                </div>
            </section>

            {/* Stats Grid */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-syne font-bold text-xl text-white">Network Stats</h3>
                    <div className="h-px flex-1 bg-border-subtle mx-6 hidden md:block" />
                </div>
                <StatCards />
            </div>

            {/* Main Workspace */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-syne font-bold text-xl text-white">Detection Interface</h3>
                        <div className="text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Multi-Modal V4.2.1</div>
                    </div>
                    <DetectionInterface onAnalyze={(data) => setResult(data)} />
                </div>

                <div className="space-y-8 min-h-[500px]">
                    <div className="flex items-center justify-between">
                        <h3 className="font-syne font-bold text-xl text-white">Forensic Analysis</h3>
                        {result && (
                            <button
                                onClick={() => setResult(null)}
                                className="text-[10px] font-ibm-plex-mono text-accent-cyan hover:text-white transition-colors uppercase tracking-widest"
                            >
                                Reset Protocol
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {result ? (
                            <ResultPanel key="result" result={result} />
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[400px] flex flex-col items-center justify-center border border-dashed border-border-subtle rounded-2xl bg-bg-secondary/10 p-12 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                    <div className="w-2 h-2 rounded-full bg-accent-cyan pulse-glow" />
                                </div>
                                <h4 className="text-text-primary font-semibold mb-2">Awaiting Forensic Input</h4>
                                <p className="text-text-secondary text-sm max-w-[280px] mx-auto">
                                    System initialized. Please upload media for deepscan validation.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Process / Feature Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                    { title: "Quantum Ingestion", desc: "Batch media processing via dedicated inference nodes." },
                    { title: "Forensic Hash", desc: "Cryptographic validation of media integrity fingerprints." },
                    { title: "Neural Validation", desc: "Cross-model validation to reduce false positive rates." }
                ].map((feature) => (
                    <div key={feature.title} className="p-6 rounded-2xl bg-bg-secondary/30 border border-border-subtle group hover:border-accent-cyan/30 transition-colors">
                        <h4 className="font-syne font-bold text-white mb-2">{feature.title}</h4>
                        <p className="font-dm-sans text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* Footer Table */}
            <div className="pt-12">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-syne font-bold text-xl text-white">Recent Forensic Logs</h3>
                    <div className="text-[10px] font-ibm-plex-mono text-accent-cyan uppercase tracking-widest">Live Updates Available</div>
                </div>
                <RecentScansTable />
            </div>
        </div>
    );
}
