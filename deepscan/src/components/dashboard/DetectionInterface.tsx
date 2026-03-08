"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { Image, Video, Mic, FileText, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
    { id: "image", label: "Image", icon: Image },
    { id: "video", label: "Video", icon: Video },
    { id: "audio", label: "Audio", icon: Mic },
    { id: "text", label: "Text", icon: FileText },
];

export function DetectionInterface({ onAnalyze }: { onAnalyze: (data: any) => void }) {
    const [activeTab, setActiveTab] = useState("image");
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setError(null);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.size > 50 * 1024 * 1024) {
                setError("Forensic limit exceeded: File size exceeds 50MB protocol safety.");
                return;
            }
            setFile(droppedFile);
        }
    };

    const handleAnalyze = () => {
        if (!file && !text) return;
        setError(null);
        setIsAnalyzing(true);

        // Simulate complex AI forensic analysis
        setTimeout(() => {
            // Randomly simulate a technical "corrupted" error for realism in 10% of cases
            if (Math.random() < 0.1) {
                setIsAnalyzing(false);
                setError("Forensic analysis failed: Media headers appear corrupted or multi-layered compression detected.");
                return;
            }

            setIsAnalyzing(false);
            onAnalyze({
                type: activeTab,
                name: file?.name || "Text Segment",
                verdict: Math.random() > 0.5 ? "FAKE" : "REAL",
                confidence: Math.floor(Math.random() * (100 - 85 + 1)) + 85,
                time: (Math.random() * 800 + 200).toFixed(0) + "ms",
                id: "SCAN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
                standards: ["IEEE-FORENSIC-V2", "ISO-MEDIA-TR-402"],
                latency: (Math.random() * 0.5).toFixed(3) + "s"
            });
            setFile(null);
            setText("");
        }, 2500);
    };

    return (
        <Card className="p-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex p-1.5 bg-bg-surface border-b border-border-subtle">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setFile(null);
                            setText("");
                            setError(null);
                        }}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-dm-sans font-medium transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan"
                                : "text-text-secondary hover:text-text-primary"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    {activeTab === "text" ? (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                        >
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste the text content you want to analyze for synthetic patterns..."
                                className="w-full h-48 bg-bg-surface border border-border-subtle rounded-xl p-4 text-text-primary font-dm-sans focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            {!file ? (
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleFileDrop}
                                    className="group cursor-pointer border-2 border-dashed border-border-subtle rounded-2xl p-12 text-center bg-accent-cyan/5 hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all duration-300"
                                    onClick={() => document.getElementById("fileInput")?.click()}
                                >
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files?.[0];
                                            if (selectedFile) {
                                                if (selectedFile.size > 50 * 1024 * 1024) {
                                                    setError("Forensic limit exceeded: File size exceeds 50MB protocol safety.");
                                                    return;
                                                }
                                                setFile(selectedFile);
                                                setError(null);
                                            }
                                        }}
                                    />
                                    <div className="w-16 h-16 rounded-full bg-accent-cyan/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-accent-cyan" />
                                    </div>
                                    <h4 className="text-text-primary font-semibold mb-2">Drop your {activeTab} here</h4>
                                    <p className="text-text-secondary text-sm">or click to browse from files</p>
                                    <div className="mt-6 flex justify-center gap-4">
                                        <Badge variant="warning" className="bg-transparent border-white/10 text-text-muted">Max 50MB</Badge>
                                        <Badge variant="warning" className="bg-transparent border-white/10 text-text-muted">.{activeTab === 'image' ? 'jpg/png' : activeTab === 'video' ? 'mp4/mov' : 'mp3/wav'}</Badge>
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-border-subtle rounded-xl p-6 flex items-center justify-between bg-bg-surface">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                                            {activeTab === 'image' ? <Image className="w-6 h-6 text-accent-cyan" /> : activeTab === 'video' ? <Video className="w-6 h-6 text-accent-cyan" /> : <Mic className="w-6 h-6 text-accent-cyan" />}
                                        </div>
                                        <div>
                                            <div className="text-text-primary font-medium truncate max-w-[200px]">{file.name}</div>
                                            <div className="text-text-muted text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                                        </div>
                                    </div>
                                    <button onClick={() => setFile(null)} className="p-2 text-text-muted hover:text-status-fake transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-lg bg-status-fake/10 border border-status-fake/20 text-status-fake text-xs font-dm-sans"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="mt-8">
                    <Button
                        className="w-full relative h-14"
                        disabled={(!file && !text) || isAnalyzing}
                        onClick={handleAnalyze}
                    >
                        {isAnalyzing ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Analyzing Media Forensic Data...</span>
                            </div>
                        ) : (
                            "Run Forensic Analysis"
                        )}
                        {isAnalyzing && (
                            <div className="absolute bottom-0 left-0 h-1 bg-white/20 animate-[progress_2.5s_ease-out_forwards]" />
                        )}
                    </Button>
                </div>
            </div>

            <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </Card>
    );
}
