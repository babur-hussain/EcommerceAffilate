import Link from "next/link";

const shippingInfo = [
    { zone: "Metro Cities", cities: "Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune", standard: "3-5 days", express: "1-2 days", free: "Above ₹499" },
    { zone: "Tier 2 Cities", cities: "Jaipur, Lucknow, Chandigarh, Ahmedabad, Surat, Nagpur, etc.", standard: "5-7 days", express: "2-3 days", free: "Above ₹499" },
    { zone: "Tier 3 & Rural", cities: "Other towns and rural areas", standard: "7-10 days", express: "4-5 days", free: "Above ₹699" },
];

const features = [
    { icon: "local_shipping", title: "Free Shipping", desc: "On orders above ₹499 to most locations" },
    { icon: "verified_user", title: "Secure Packaging", desc: "All items carefully packed to prevent damage" },
    { icon: "support_agent", title: "Real-time Tracking", desc: "Track your package from dispatch to delivery" },
    { icon: "replay", title: "Easy Returns", desc: "Hassle-free returns within 7 days" },
];

export default function ShippingInfoPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Shipping Info</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">package_2</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Shipping Information</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">We deliver across India. Here&apos;s everything you need to know about our shipping policies.</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {features.map((f, i) => (
                        <div key={i} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <span className="material-symbols-outlined text-3xl text-primary mb-3 block">{f.icon}</span>
                            <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                            <p className="text-xs text-slate-500">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Delivery Timeline Table */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Delivery Timelines</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Zone</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Coverage</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Standard</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Express</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">Free Shipping</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shippingInfo.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 border-b border-slate-100">
                                        <td className="px-4 py-4 font-bold text-sm">{row.zone}</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{row.cities}</td>
                                        <td className="px-4 py-4 text-sm">{row.standard}</td>
                                        <td className="px-4 py-4 text-sm">{row.express}</td>
                                        <td className="px-4 py-4 text-sm text-green-600 font-semibold">{row.free}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Shipping Charges */}
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 pb-12">
                    <h2 className="text-xl font-bold mb-4">Shipping Charges</h2>
                    <div className="space-y-3 text-sm text-slate-600">
                        <p className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> <strong>Standard Delivery:</strong> ₹49 for orders under ₹499</p>
                        <p className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> <strong>Express Delivery:</strong> Additional ₹99 (available in select cities)</p>
                        <p className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> <strong>COD:</strong> Additional ₹29 convenience fee</p>
                        <p className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> <strong>International:</strong> Currently not available</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
