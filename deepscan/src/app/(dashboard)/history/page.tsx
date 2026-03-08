"use client";

import { Badge, Button } from "@/components/ui";
import { Search, Filter, Download, MoreHorizontal, Calendar, ArrowUpDown } from "lucide-react";
import { RecentScansTable } from "@/components/dashboard/RecentScansTable";

export default function HistoryPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="font-syne text-3xl font-bold text-white tracking-tight">Forensic History</h1>
                    <p className="text-text-secondary font-dm-sans">Complete audit trail of all media forensic investigations.</p>
                </div>
                <Button variant="secondary" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Audit Log
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by Scan ID, File Name or Hash..."
                        className="w-full bg-bg-secondary border border-border-subtle rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <Button variant="secondary" className="gap-2 h-11 flex-1 lg:flex-none">
                        <Calendar className="w-4 h-4" />
                        Date Range
                    </Button>
                    <Button variant="secondary" className="gap-2 h-11 flex-1 lg:flex-none">
                        <Filter className="w-4 h-4" />
                        Media Type
                    </Button>
                    <Button variant="secondary" className="gap-2 h-11 flex-1 lg:flex-none">
                        <ArrowUpDown className="w-4 h-4" />
                        Verdict
                    </Button>
                </div>
            </div>

            {/* Scans Count */}
            <div className="flex items-center justify-between text-[10px] font-ibm-plex-mono text-text-muted uppercase tracking-[0.2em] px-2">
                <span>Showing 15 of 1,284 investigations</span>
                <span className="text-accent-cyan">Auto-update enabled</span>
            </div>

            {/* Table */}
            <RecentScansTable />

            {/* Pagination Mock */}
            <div className="flex items-center justify-center gap-2 pt-8">
                <Button variant="secondary" size="sm" disabled>Prev</Button>
                {[1, 2, 3, "...", 12].map((p, i) => (
                    <button
                        key={i}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-dm-sans transition-colors ${p === 1 ? 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan' : 'text-text-muted hover:text-white'}`}
                    >
                        {p}
                    </button>
                ))}
                <Button variant="secondary" size="sm">Next</Button>
            </div>
        </div>
    );
}
