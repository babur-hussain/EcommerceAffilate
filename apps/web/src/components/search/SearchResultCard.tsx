import Link from "next/link";

interface Product {
    _id: string;
    title: string;
    slug: string;
    price: number;
    mrp?: number;
    primaryImage: string;
    brand: string;
    rating?: number;
}

export default function SearchResultCard({ product }: { product: Product }) {
    const discount = product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <Link href={`/product/${product._id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full border border-transparent hover:border-primary/20">
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                    src={product.primaryImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Express Badge - Mocked for now or check product.deliveryEstimate */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.rating && product.rating >= 4.5 && (
                        <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider shadow-lg shadow-primary/20">
                            Best Seller
                        </span>
                    )}
                </div>

                <button className="absolute top-3 right-3 h-8 w-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                </button>

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/60 to-transparent">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/40">
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                        {product.brand}
                    </span>
                    {product.rating ? (
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm filled-star text-[#F5CE22]">star</span>
                            <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                        </div>
                    ) : null}
                </div>

                <h3 className="font-bold text-lg leading-tight mb-2 text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex flex-col">
                        <p className="text-xl font-black text-primary">₹{product.price.toFixed(2)}</p>
                        {discount > 0 && (
                            <p className="text-[10px] text-red-500 font-bold line-through">₹{product.mrp?.toFixed(2)}</p>
                        )}
                    </div>
                    {discount > 0 && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                            -{discount}%
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
