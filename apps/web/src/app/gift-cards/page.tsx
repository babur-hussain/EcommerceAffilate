import Link from "next/link";

export default function GiftCardsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span>
                        Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Gift Cards</span>
                </div>

                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-32 h-32 bg-linear-to-br from-primary/10 to-sky-100 rounded-full flex items-center justify-center mb-8">
                        <span className="material-symbols-outlined text-6xl text-primary">redeem</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">Gift Cards</h1>
                    <p className="text-slate-500 text-lg max-w-lg mb-8">
                        The perfect gift for anyone. Our gift cards are coming soon — give the gift of choice to your loved ones.
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl font-semibold">
                        <span className="material-symbols-outlined">schedule</span>
                        Coming Soon
                    </div>
                    <Link href="/" className="mt-6 text-primary font-semibold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Shopping
                    </Link>
                </div>
            </main>
        </div>
    );
}
