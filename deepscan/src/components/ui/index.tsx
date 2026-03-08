import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "icon";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-gradient-to-br from-accent-cyan to-accent-blue text-bg-primary shadow-[0_4px_20px_rgba(0,212,255,0.3)] hover:brightness-110 active:scale-95",
            secondary: "bg-transparent border border-border-subtle text-text-secondary hover:border-accent-cyan hover:text-text-primary",
            danger: "bg-status-fake/10 border border-status-fake/30 text-status-fake hover:bg-status-fake/20",
            ghost: "bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary",
            icon: "bg-bg-surface border border-border-subtle p-2 hover:border-accent-cyan",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-6 py-2.5 text-sm",
            lg: "px-8 py-3.5 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-dm-sans font-medium uppercase tracking-[0.08em] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    variant !== "icon" && sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export const Card = ({ className, hover = true, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                "bg-bg-secondary border border-border-subtle rounded-xl p-6 shadow-[0_0_40px_rgba(0,212,255,0.06),inset_0_1px_0_rgba(255,255,255,0.04)]",
                hover && "hover:border-accent-cyan/30 hover:shadow-[0_0_60px_rgba(0,212,255,0.1)] transition-all duration-300",
                className
            )}
            {...props}
        />
    );
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "fake" | "real" | "warning";
}

export const Badge = ({ className, variant = "real", ...props }: BadgeProps) => {
    const variants = {
        fake: "bg-status-fake/15 border-status-fake/30 text-status-fake",
        real: "bg-status-real/15 border-status-real/30 text-status-real",
        warning: "bg-status-warning/15 border-status-warning/30 text-status-warning",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-ibm-plex-mono font-medium uppercase tracking-wider",
                variants[variant],
                className
            )}
            {...props}
        />
    );
};
