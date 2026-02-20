import Link from "next/link";

const values = [
    { icon: "handshake", title: "Trust", desc: "We build lasting relationships with sellers and customers through transparency and honesty." },
    { icon: "public", title: "Local First", desc: "Empowering local businesses and artisans to reach a national audience." },
    { icon: "diversity_3", title: "Community", desc: "Building a vibrant ecosystem of sellers, influencers, and shoppers." },
    { icon: "eco", title: "Sustainability", desc: "Promoting eco-friendly practices and sustainable products." },
];

const stats = [
    { value: "10K+", label: "Products Listed" },
    { value: "500+", label: "Verified Sellers" },
    { value: "50K+", label: "Happy Customers" },
    { value: "100+", label: "Cities Served" },
];

const team = [
    { name: "Babur Hussain", role: "Founder & CEO", icon: "person" },
    { name: "Tech Team", role: "Engineering", icon: "code" },
    { name: "Support Team", role: "Customer Success", icon: "support_agent" },
    { name: "Design Team", role: "Product Design", icon: "palette" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">About Us</span>
                </div>

                {/* Hero */}
                <div className="text-center mb-16 py-8">
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/30">
                        <span className="material-symbols-outlined text-white text-4xl">shopping_bag</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">About Local For Vocal Startup</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        We&apos;re building India&apos;s most trusted marketplace — connecting local sellers with customers who love quality, authenticity, and great value.
                    </p>
                </div>

                {/* Our Story */}
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            Local For Vocal Startup was born from a simple belief: that local businesses deserve a powerful platform to showcase their products to the world. We saw talented artisans, passionate entrepreneurs, and quality manufacturers struggling to reach customers beyond their neighborhoods.
                        </p>
                        <p>
                            Our platform bridges this gap by providing a modern, technology-driven marketplace where local sellers can list their products, manage orders, and grow their businesses — while customers discover authentic, high-quality products at great prices.
                        </p>
                        <p>
                            From fashion to electronics, groceries to home décor, we curate the best of local India and deliver it right to your doorstep. Our influencer network amplifies seller reach, and our robust logistics ensure timely delivery across the country.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center p-6 bg-linear-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
                            <div className="text-3xl font-extrabold text-primary mb-1">{s.value}</div>
                            <div className="text-sm text-slate-500 font-semibold">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Values */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {values.map((v, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <span className="material-symbols-outlined text-3xl text-primary mb-3 block">{v.icon}</span>
                                <h3 className="font-bold mb-2">{v.title}</h3>
                                <p className="text-sm text-slate-500">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {team.map((t, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-primary text-2xl">{t.icon}</span>
                                </div>
                                <h3 className="font-bold text-sm">{t.name}</h3>
                                <p className="text-xs text-slate-500">{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
