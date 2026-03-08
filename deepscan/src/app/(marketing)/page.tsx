"use client";

import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/Footer";

export default function Home() {
    return (
        <>
            <Hero />
            <FeatureGrid />
            <HowItWorks />
        </>
    );
}
