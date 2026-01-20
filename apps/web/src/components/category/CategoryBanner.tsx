"use client";

interface CategoryBannerProps {
    name: string;
    description?: string;
    image?: string;
    productCount: number;
}

export default function CategoryBanner({ name, description, image, productCount }: CategoryBannerProps) {
    const defaultImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2670&auto=format&fit=crop";

    return (
        <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: `linear-gradient(90deg, rgba(25, 161, 230, 0.85) 0%, rgba(25, 161, 230, 0.4) 50%, rgba(0,0,0,0) 100%), url("${image || defaultImage}")`
                }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 md:px-12 text-white max-w-lg">
                <span className="text-xs font-bold uppercase tracking-widest mb-3 opacity-90">
                    Curated Selection
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                    {name}
                </h1>
                {description && (
                    <p className="text-sm md:text-base font-medium mb-4 opacity-80 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}
                <p className="text-sm opacity-70 mb-6">
                    {productCount} {productCount === 1 ? "product" : "products"} available
                </p>
                <div className="flex gap-3">
                    <button className="bg-white text-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors">
                        Shop All
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white/30 transition-colors">
                        New Arrivals
                    </button>
                </div>
            </div>
        </div>
    );
}
