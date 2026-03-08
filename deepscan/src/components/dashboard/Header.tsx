"use client";

import { Bell, Search, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="h-16 border-b border-border-subtle bg-bg-primary/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search scans, reports, or assets..."
                        className="w-full bg-bg-secondary border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-sm font-dm-sans focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-text-secondary hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-cyan rounded-full border-2 border-bg-primary" />
                </button>
                <div className="h-6 w-px bg-border-subtle mx-2" />
                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-semibold text-white">Sushil Giri</div>
                        <div className="text-[10px] text-accent-cyan uppercase tracking-wider">Pro Analyst</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center group-hover:border-accent-cyan transition-colors">
                        <User className="w-4 h-4 text-accent-blue" />
                    </div>
                </div>
            </div>
        </header>
    );
}
