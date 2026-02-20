import Link from "next/link";

const sizeCharts = [
    {
        category: "Men's Clothing",
        icon: "man",
        headers: ["Size", "Chest (in)", "Waist (in)", "Hip (in)"],
        rows: [
            ["S", "36-38", "28-30", "36-38"],
            ["M", "38-40", "30-32", "38-40"],
            ["L", "40-42", "32-34", "40-42"],
            ["XL", "42-44", "34-36", "42-44"],
            ["XXL", "44-46", "36-38", "44-46"],
        ],
    },
    {
        category: "Women's Clothing",
        icon: "woman",
        headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)"],
        rows: [
            ["XS", "30-32", "24-26", "33-35"],
            ["S", "32-34", "26-28", "35-37"],
            ["M", "34-36", "28-30", "37-39"],
            ["L", "36-38", "30-32", "39-41"],
            ["XL", "38-40", "32-34", "41-43"],
            ["XXL", "40-42", "34-36", "43-45"],
        ],
    },
    {
        category: "Kids' Clothing",
        icon: "child_care",
        headers: ["Age", "Size", "Chest (in)", "Height (cm)"],
        rows: [
            ["2-3 yrs", "2Y", "20-21", "92-98"],
            ["3-4 yrs", "3Y", "21-22", "98-104"],
            ["4-5 yrs", "4Y", "22-23", "104-110"],
            ["5-6 yrs", "5Y", "23-24", "110-116"],
            ["6-7 yrs", "6Y", "24-25", "116-122"],
            ["7-8 yrs", "7Y", "25-26", "122-128"],
        ],
    },
    {
        category: "Footwear",
        icon: "steps",
        headers: ["India", "UK", "US", "EU", "Foot Length (cm)"],
        rows: [
            ["6", "5", "6", "39", "24.5"],
            ["7", "6", "7", "40", "25.1"],
            ["8", "7", "8", "41", "25.7"],
            ["9", "8", "9", "42", "26.3"],
            ["10", "9", "10", "43", "27.1"],
            ["11", "10", "11", "44", "27.9"],
        ],
    },
];

const tips = [
    { icon: "straighten", tip: "Measure over light clothing for accurate results" },
    { icon: "accessibility_new", tip: "Stand straight and relax your arms at your sides" },
    { icon: "balance", tip: "If between sizes, we recommend sizing up" },
    { icon: "checkroom", tip: "Refer to individual product pages for specific notes" },
];

export default function SizeGuidePage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Size Guide</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">straighten</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Size Guide</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Find your perfect fit with our comprehensive size charts.</p>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {tips.map((t, i) => (
                        <div key={i} className="text-center p-5 bg-primary/5 rounded-2xl border border-primary/10">
                            <span className="material-symbols-outlined text-2xl text-primary mb-2 block">{t.icon}</span>
                            <p className="text-xs font-semibold text-slate-700">{t.tip}</p>
                        </div>
                    ))}
                </div>

                {/* Size Charts */}
                <div className="space-y-10 pb-12">
                    {sizeCharts.map((chart, i) => (
                        <div key={i}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">{chart.icon}</span>
                                <h2 className="text-xl font-bold">{chart.category}</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            {chart.headers.map((h, j) => (
                                                <th key={j} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chart.rows.map((row, ri) => (
                                            <tr key={ri} className="hover:bg-slate-50 border-b border-slate-100">
                                                {row.map((cell, ci) => (
                                                    <td key={ci} className={`px-4 py-3 text-sm ${ci === 0 ? "font-bold" : "text-slate-600"}`}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
