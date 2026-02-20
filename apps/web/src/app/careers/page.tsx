import Link from "next/link";

const openings = [
    { title: "Full Stack Developer", team: "Engineering", location: "Remote / Bangalore", type: "Full-time", icon: "code" },
    { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time", icon: "palette" },
    { title: "Customer Support Executive", team: "Operations", location: "Delhi NCR", type: "Full-time", icon: "support_agent" },
    { title: "Digital Marketing Manager", team: "Marketing", location: "Remote", type: "Full-time", icon: "campaign" },
    { title: "Logistics Coordinator", team: "Operations", location: "Mumbai", type: "Full-time", icon: "local_shipping" },
    { title: "Content Writer", team: "Marketing", location: "Remote", type: "Part-time", icon: "edit_note" },
];

const perks = [
    { icon: "home", title: "Remote First", desc: "Work from anywhere in India" },
    { icon: "health_and_safety", title: "Health Insurance", desc: "Comprehensive health coverage" },
    { icon: "school", title: "Learning Budget", desc: "Annual learning & development fund" },
    { icon: "devices", title: "Equipment", desc: "Latest tools and hardware provided" },
    { icon: "event", title: "Flexible Hours", desc: "Work when you're most productive" },
    { icon: "groups", title: "Team Events", desc: "Quarterly meetups and retreats" },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Careers</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">work</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Join Our Team</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Help us build India&apos;s most loved local marketplace. We&apos;re looking for passionate people who want to make a difference.</p>
                </div>

                {/* Perks */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">Why Work With Us</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {perks.map((p, i) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <span className="material-symbols-outlined text-2xl text-primary mb-2 block">{p.icon}</span>
                                <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                                <p className="text-xs text-slate-500">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Openings */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
                    <div className="space-y-3">
                        {openings.map((job, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">{job.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{job.title}</h3>
                                        <p className="text-sm text-slate-500">{job.team} · {job.location} · {job.type}</p>
                                    </div>
                                </div>
                                <Link href="/contact" className="px-4 py-2 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-colors">
                                    Apply
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-600 mb-3">Don&apos;t see a role that fits?</p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined">mail</span>
                        Send Us Your Resume
                    </Link>
                </div>
            </main>
        </div>
    );
}
