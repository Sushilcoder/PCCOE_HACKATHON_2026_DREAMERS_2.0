"use client";

import { Button, Badge } from "@/components/ui";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative pt-48 pb-32 lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-accent-cyan/10 blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 text-center w-full min-h-[70vh] flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="real" className="mb-8 border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan">
                        AI-Powered Detection
                    </Badge>
                </motion.div>

                <motion.h1
                    className="font-syne text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.2] tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Stop Deepfakes.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">
                        Protect Digital Truth.
                    </span>
                </motion.h1>

                <motion.p
                    className="font-dm-sans text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    A unified forensic platform to detect manipulated Images, Videos, Audio, and Text.
                    Restore trust in modern media with industry-leading AI detection.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link href="/dashboard">
                        <Button size="lg" className="gap-2 group">
                            Start Detecting
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Button variant="secondary" size="lg" className="gap-2">
                        <Play className="w-4 h-4" />
                        View Demo
                    </Button>
                </motion.div>

                <motion.div
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-text-muted font-ibm-plex-mono text-xs uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-accent-cyan">04</span> Media Types
                    </div>
                    <span className="hidden sm:inline opacity-30 text-xl font-thin">·</span>
                    <div className="flex items-center gap-2">
                        <span className="text-accent-cyan">&lt;500ms</span> Inference
                    </div>
                    <span className="hidden sm:inline opacity-30 text-xl font-thin">·</span>
                    <div className="flex items-center gap-2">
                        <span className="text-accent-cyan">99.2%</span> Accuracy
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
