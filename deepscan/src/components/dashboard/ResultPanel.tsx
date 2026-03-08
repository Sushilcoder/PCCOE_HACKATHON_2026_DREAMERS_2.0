"use client";

import { Card, Badge } from "@/components/ui";
import { ShieldCheck, ShieldAlert, Clock, Cpu, Hash, FileCheck, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ResultPanel({ result }: { result: any }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (result) {
            setCount(0);
            const duration = 1500;
            const steps = 60;
            const increment = result.confidence / steps;
            const stepTime = duration / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= result.confidence) {
                    setCount(result.confidence);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, stepTime);
            return () => clearInterval(timer);
        }
    }, [result]);

    if (!result) return null;

    const isFake = result.verdict === "FAKE";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="p-8 border-l-4" style={{ borderColor: isFake ? 'var(--color-status-fake)' : 'var(--color-status-real)' }}>
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Verdict */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4">
                            {isFake ? (
                                <div className="w-12 h-12 rounded-xl bg-status-fake/10 flex items-center justify-center">
                                    <ShieldAlert className="w-6 h-6 text-status-fake" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-status-real/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-status-real" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-text-secondary font-dm-sans text-sm uppercase tracking-widest">{result.name}</h4>
                                <p className="text-white text-xs font-ibm-plex-mono mt-1">{result.id}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Inference Verdict</span>
                            <div className={isFake ? "text-status-fake" : "text-status-real"}>
                                <h2 className="font-syne text-6xl font-bold tracking-tighter">{result.verdict}</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-ibm-plex-mono">
                                <span className="text-text-secondary uppercase">Confidence Score</span>
                                <span className={isFake ? "text-status-fake" : "text-status-real"}>{count}%</span>
                            </div>
                            <div className="h-2 w-full bg-border-subtle rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.confidence}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={isFake ? "h-full bg-status-fake" : "h-full bg-status-real"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="w-full lg:w-72 space-y-6 pt-6 lg:pt-0 lg:border-l lg:border-border-subtle lg:pl-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Cpu className="w-4 h-4 text-accent-cyan" />
                                <span className="text-xs font-dm-sans text-text-secondary">Model: Forensic-Vision-V4</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-accent-cyan" />
                                <span className="text-xs font-dm-sans text-text-secondary">Latency: {result.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileCheck className="w-4 h-4 text-accent-cyan" />
                                <span className="text-xs font-dm-sans text-text-secondary">Standard: IEEE-P2302</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-subtle">
                            <button className="flex items-center justify-between w-full group">
                                <span className="text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Advanced Metrics</span>
                                <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-accent-cyan transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
