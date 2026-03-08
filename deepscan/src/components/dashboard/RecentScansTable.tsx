"use client";

import { Badge } from "@/components/ui";
import { Copy, ExternalLink, MoreVertical } from "lucide-react";

const scans = [
    { id: "SCAN-A8F2K9", type: "Image", name: "profile_px_01.jpg", verdict: "REAL", confidence: 98.4, time: "2h ago" },
    { id: "SCAN-J4L1M5", type: "Video", name: "statement_final.mp4", verdict: "FAKE", confidence: 94.2, time: "5h ago" },
    { id: "SCAN-N7Q3P8", type: "Audio", name: "voice_memo_04.wav", verdict: "FAKE", confidence: 89.7, time: "Yesterday" },
    { id: "SCAN-T2R6S9", type: "Text", name: "news_article_clipping", verdict: "REAL", confidence: 96.1, time: "2 days ago" },
    { id: "SCAN-X5V8W1", type: "Image", name: "event_photo_3.png", verdict: "FAKE", confidence: 91.5, time: "3 days ago" },
];

export function RecentScansTable() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-syne font-bold text-xl text-white">Recent Forensic Scans</h3>
                <button className="text-xs font-dm-sans text-accent-cyan hover:underline">View All History</button>
            </div>

            <div className="bg-bg-secondary border border-border-subtle rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-subtle bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Scan ID</th>
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Verdict</th>
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Confidence</th>
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {scans.map((scan) => (
                                <tr key={scan.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 group-hover:text-accent-cyan transition-colors">
                                            <span className="font-ibm-plex-mono text-xs">{scan.id}</span>
                                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50 cursor-pointer" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-dm-sans text-text-secondary">{scan.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-dm-sans text-text-primary font-medium">{scan.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={scan.verdict === "FAKE" ? "fake" : "real"}>
                                            {scan.verdict}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-1.5 bg-border-subtle rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${scan.verdict === 'FAKE' ? 'bg-status-fake' : 'bg-status-real'}`}
                                                    style={{ width: `${scan.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-ibm-plex-mono text-text-secondary">{scan.confidence}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-dm-sans text-text-muted">{scan.time}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 rounded-lg border border-border-subtle hover:border-accent-cyan transition-colors">
                                                <ExternalLink className="w-4 h-4 text-text-muted hover:text-accent-cyan" />
                                            </button>
                                            <button className="p-1.5 rounded-lg border border-border-subtle hover:border-accent-cyan transition-colors">
                                                <MoreVertical className="w-4 h-4 text-text-muted hover:text-accent-cyan" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
