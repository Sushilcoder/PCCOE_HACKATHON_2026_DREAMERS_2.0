"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-bg-primary overflow-x-hidden">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div
                className={cn(
                    "flex-1 flex flex-col min-w-0 transition-all duration-300",
                    collapsed ? "ml-16" : "ml-16 md:ml-60"
                )}
            >
                <Header />
                <main className="flex-1 p-4 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto space-y-16 w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
