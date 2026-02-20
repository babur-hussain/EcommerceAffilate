import Link from "next/link";

const policies = [
    { title: "Eligibility", icon: "check_circle", items: ["Products must be returned within 7 days of delivery", "Items should be unused and in original packaging", "Tags and labels must be intact", "Electronics must include all original accessories"] },
    { title: "Non-Returnable Items", icon: "block", items: ["Innerwear, swimwear, and lingerie", "Customized or personalized products", "Perishable goods (food, flowers)", "Digital downloads and gift cards", "Products with hygiene seal broken"] },
    { title: "Refund Process", icon: "payments", items: ["Refunds initiated within 24 hours of pickup", "Amount credited in 5-7 business days", "Refund to original payment method", "COD orders refunded to bank account or store credit"] },
    { title: "Exchange Policy", icon: "swap_horiz", items: ["Exchange available for size/color change", "Subject to stock availability", "No additional shipping charges", "One exchange per order allowed"] },
];

const steps = [
    { step: "1", title: "Initiate Return", desc: "Go to My Orders, select the item and click 'Return'", icon: "touch_app" },
    { step: "2", title: "Schedule Pickup", desc: "Choose a convenient time slot for pickup", icon: "schedule" },
    { step: "3", title: "Pack the Item", desc: "Pack the product in its original packaging", icon: "inventory_2" },
    { step: "4", title: "Get Refund", desc: "Refund processed after quality check", icon: "account_balance_wallet" },
];

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Returns & Refunds</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">autorenew</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Returns & Refund Policy</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">We want you to love what you buy. If something isn&apos;t right, we make returns easy.</p>
                </div>

                {/* How It Works */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">How Returns Work</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {steps.map((s) => (
                            <div key={s.step} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-primary">{s.icon}</span>
                                </div>
                                <h3 className="font-bold mb-1">{s.title}</h3>
                                <p className="text-xs text-slate-500">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Policies */}
                <div className="grid md:grid-cols-2 gap-6 pb-12">
                    {policies.map((p, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">{p.icon}</span>
                                <h3 className="text-lg font-bold">{p.title}</h3>
                            </div>
                            <ul className="space-y-2">
                                {p.items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400 text-sm mt-0.5">arrow_right</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
