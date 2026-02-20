import Link from "next/link";

const posts = [
    { title: "10 Tips for Smart Online Shopping", excerpt: "Make the most of your online shopping experience with these expert tips on finding deals, comparing products, and securing the best prices.", date: "Feb 15, 2026", category: "Shopping Tips", icon: "shopping_cart", readTime: "5 min" },
    { title: "How to Start Selling Online in India", excerpt: "A comprehensive guide for new sellers looking to launch their business on our platform, from registration to your first sale.", date: "Feb 10, 2026", category: "Seller Guide", icon: "storefront", readTime: "8 min" },
    { title: "Fashion Trends to Watch in 2026", excerpt: "From sustainable fashion to bold prints, discover the trends that will define style this year and shop them on our platform.", date: "Feb 5, 2026", category: "Fashion", icon: "checkroom", readTime: "4 min" },
    { title: "Supporting Local: Why It Matters", excerpt: "Every purchase from a local seller strengthens communities. Learn how your shopping choices create ripple effects of positive change.", date: "Jan 28, 2026", category: "Community", icon: "favorite", readTime: "6 min" },
    { title: "The Ultimate Guide to Influencer Marketing", excerpt: "How our influencer partnership program works and how creators can monetize their audience by recommending products they love.", date: "Jan 20, 2026", category: "Influencers", icon: "campaign", readTime: "7 min" },
    { title: "Shipping & Delivery: Behind the Scenes", excerpt: "A look at how we ensure your orders reach you safely and on time — from warehouse to your doorstep.", date: "Jan 12, 2026", category: "Operations", icon: "local_shipping", readTime: "5 min" },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Blog</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">edit_note</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Our Blog</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Insights, tips, and stories from the Local For Vocal community.</p>
                </div>

                {/* Featured Post */}
                <div className="mb-10 p-8 bg-linear-to-br from-primary/5 to-sky-50 rounded-2xl border border-primary/10">
                    <div className="flex items-start gap-6 flex-col md:flex-row">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-3xl">{posts[0].icon}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-bold text-primary uppercase">{posts[0].category}</span>
                                <span className="text-xs text-slate-400">{posts[0].date}</span>
                                <span className="text-xs text-slate-400">· {posts[0].readTime} read</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-3">{posts[0].title}</h2>
                            <p className="text-slate-600 leading-relaxed">{posts[0].excerpt}</p>
                        </div>
                    </div>
                </div>

                {/* Post Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {posts.slice(1).map((post, i) => (
                        <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-primary/20 transition-all flex flex-col">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">{post.icon}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary uppercase">{post.category}</span>
                                    <div className="text-[10px] text-slate-400">{post.date} · {post.readTime} read</div>
                                </div>
                            </div>
                            <h3 className="font-bold mb-2">{post.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed flex-1">{post.excerpt}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
