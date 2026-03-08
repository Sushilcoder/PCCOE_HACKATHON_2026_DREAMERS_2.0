"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui";

export function LandingNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-border-subtle bg-bg-primary/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                        <Shield className="w-5 h-5 text-bg-primary" />
                    </div>
                    <span className="font-syne font-bold text-2xl tracking-tight text-white">
                        DeepScan
                        <span className="text-accent-cyan">.</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {["Features", "How It Works", "About", "Team"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm font-dm-sans font-medium text-text-secondary hover:text-accent-cyan transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <Link href="/dashboard">
                    <Button variant="primary">
                        Launch Dashboard
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
