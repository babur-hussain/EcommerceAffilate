import Link from "next/link";

const pressReleases = [
    { date: "Feb 2026", title: "Local For Vocal Startup Launches Influencer Partnership Program", desc: "Our new influencer network connects creators with local brands, enabling authentic product recommendations and competitive commissions.", icon: "campaign" },
    { date: "Jan 2026", title: "Expanding to 100+ Cities Across India", desc: "We've scaled our logistics network to serve over 100 cities, bringing local products to doorsteps nationwide.", icon: "location_on" },
    { date: "Dec 2025", title: "500+ Verified Sellers Join the Platform", desc: "Our seller community continues to grow, with rigorous verification ensuring quality and trust for every customer.", icon: "storefront" },
    { date: "Nov 2025", title: "Launch of Server-Driven UI for Personalized Shopping", desc: "Our innovative SDUI technology delivers personalized shopping experiences to each customer, powered by real-time data.", icon: "devices" },
];

const mediaMentions = [
    { outlet: "Business Today", quote: "A promising marketplace empowering India's local sellers with cutting-edge technology." },
    { outlet: "Startup India", quote: "Local For Vocal Startup is bridging the gap between local businesses and digital commerce." },
    { outlet: "YourStory", quote: "An innovative approach to e-commerce that puts local sellers first." },
];

export default function PressPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Press</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">newspaper</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Press & Media</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Latest news, press releases, and media coverage about Local For Vocal Startup.</p>
                </div>

                {/* Press Releases */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Press Releases</h2>
                    <div className="space-y-4">
                        {pressReleases.map((pr, i) => (
                            <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary">{pr.icon}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 font-semibold uppercase">{pr.date}</span>
                                        <h3 className="font-bold text-lg mt-1 mb-2">{pr.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{pr.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Media Mentions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Media Mentions</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {mediaMentions.map((m, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <span className="material-symbols-outlined text-2xl text-amber-500 mb-3 block">format_quote</span>
                                <p className="text-slate-600 text-sm italic mb-4">&ldquo;{m.quote}&rdquo;</p>
                                <p className="font-bold text-sm text-primary">— {m.outlet}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Press Contact */}
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-lg mb-2">Media Inquiries</h3>
                    <p className="text-slate-500 text-sm mb-4">For press inquiries, interviews, or media kits, please reach out.</p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined">mail</span>
                        Contact Press Team
                    </Link>
                </div>
            </main>
        </div>
    );
}
