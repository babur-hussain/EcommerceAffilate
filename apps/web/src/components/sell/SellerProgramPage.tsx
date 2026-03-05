"use client";
import HeroSection from "./HeroSection";
import SellerProblems from "./SellerProblems";
import MarketplaceComparison from "./MarketplaceComparison";
import CommissionStructure from "./CommissionStructure";
import SellerBenefits from "./SellerBenefits";
import InfluencerAffiliateSystem from "./InfluencerAffiliateSystem";
import SellerOnboardingProcess from "./SellerOnboardingProcess";
import OrderLifecycle from "./OrderLifecycle";
import SellerDashboard from "./SellerDashboard";
import PlatformFeatures from "./PlatformFeatures";
import TechnologyArchitecture from "./TechnologyArchitecture";
import CaseStudies from "./CaseStudies";
import SellerFAQ from "./SellerFAQ";
import CallToAction from "./CallToAction";
import { FadeIn } from "./AnimatedSection";
import { ArrowRight } from "lucide-react";

function MidCTA() {
    return (
        <section className="py-10 sm:py-14 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="max-w-4xl mx-auto px-5 sm:px-4 text-center">
                <FadeIn>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 sm:mb-4">Ready to Start Earning More?</h3>
                    <p className="text-blue-100/80 mb-5 sm:mb-6 text-sm sm:text-lg">Join thousands of sellers already growing on Local For Vocal.</p>
                    <a href="#register" className="inline-flex items-center justify-center gap-2 bg-white active:bg-slate-50 text-blue-700 font-bold px-8 py-3.5 rounded-xl text-base shadow-lg transition-all w-full sm:w-auto">
                        Register Now <ArrowRight className="w-5 h-5" />
                    </a>
                </FadeIn>
            </div>
        </section>
    );
}

export default function SellerProgramPage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <SellerProblems />
            <MarketplaceComparison />
            <CommissionStructure />
            <MidCTA />
            <SellerBenefits />
            <InfluencerAffiliateSystem />
            <SellerOnboardingProcess />
            <SellerDashboard />
            <PlatformFeatures />
            <OrderLifecycle />
            <CaseStudies />
            <TechnologyArchitecture />
            <SellerFAQ />
            <CallToAction />
        </div>
    );
}
