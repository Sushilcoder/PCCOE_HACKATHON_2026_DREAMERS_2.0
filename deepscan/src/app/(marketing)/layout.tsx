import { LandingNavbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <LandingNavbar />
            <div className="h-16" />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
