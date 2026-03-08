"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Upload,
    History,
    BarChart3,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    User
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "New Scan", href: "/dashboard/new", icon: Upload },
    { name: "Scan History", href: "/history", icon: History },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({
    collapsed,
    onToggle
}: {
    collapsed: boolean;
    onToggle: () => void
}) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "h-screen bg-bg-primary border-r border-border-subtle transition-all duration-300 z-50 flex flex-col overflow-x-hidden shrink-0",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                <div className={cn("flex items-center gap-2", collapsed && "hidden")}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                        <Shield className="w-5 h-5 text-bg-primary" />
                    </div>
                    <span className="font-syne font-bold text-xl tracking-tight text-white">
                        DeepScan
                        <span className="text-accent-cyan">.</span>
                    </span>
                </div>
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg border border-border-subtle bg-bg-surface hover:border-accent-cyan transition-colors"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
                                isActive
                                    ? "bg-accent-cyan/10 text-white"
                                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent-cyan rounded-r-full" />
                            )}
                            <item.icon className={cn(
                                "w-5 h-5 min-w-[20px]",
                                isActive ? "text-accent-cyan" : "group-hover:text-accent-cyan transition-colors"
                            )} />
                            {!collapsed && (
                                <span className="font-dm-sans text-sm font-medium whitespace-nowrap">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border-subtle">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-xl bg-bg-secondary border border-border-subtle ring-1 ring-inset ring-white/5",
                    collapsed ? "justify-center" : "justify-between"
                )}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 min-w-[36px] rounded-full bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center">
                            <User className="w-5 h-5 text-accent-violet" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-dm-sans font-semibold text-text-primary truncate">Sushil Giri</span>
                                <span className="text-[10px] font-ibm-plex-mono text-accent-cyan uppercase tracking-wider">Investigator</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
