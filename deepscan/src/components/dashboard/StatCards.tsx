"use client";

import { Card } from "@/components/ui";
import { TrendingUp, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

const stats = [
    {
        label: "Total Scans",
        value: "1,284",
        change: "+12.5%",
        icon: TrendingUp,
        color: "text-text-primary"
    },
    {
        label: "Fakes Detected",
        value: "156",
        change: "+4.2%",
        icon: AlertTriangle,
        color: "text-status-fake"
    },
    {
        label: "Accuracy Rate",
        value: "99.2%",
        change: "+0.1%",
        icon: CheckCircle2,
        color: "text-status-real"
    },
    {
        label: "Avg. Inference",
        value: "420ms",
        change: "-15ms",
        icon: Zap,
        color: "text-accent-cyan"
    }
];

export function StatCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="py-4 px-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-bg-surface border border-border-subtle ${stat.color.replace('text-', 'text-opacity-20 ')}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <span className={`text-[10px] font-ibm-plex-mono px-2 py-0.5 rounded-full border border-white/5 bg-white/5 ${stat.change.startsWith('+') ? 'text-status-real' : 'text-accent-cyan'}`}>
                            {stat.change}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-wider">
                            {stat.label}
                        </span>
                        <h3 className={`text-2xl font-bold font-ibm-plex-mono text-white`}>
                            {stat.value}
                        </h3>
                    </div>
                </Card>
            ))}
        </div>
    );
}
