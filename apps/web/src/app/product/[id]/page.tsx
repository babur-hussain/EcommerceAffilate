"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Header from "@/components/header/Header";
import CategoryNav from "@/components/header/CategoryNav";
import Footer from "@/components/footer/Footer";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import ProductActions from "@/components/product/ProductActions";
import { BackendProduct } from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_BASE}/products/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryNav />
        <main className="max-w-300 mx-auto px-6 py-16 text-center">
          <div className="text-gray-600">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryNav />
        <main className="max-w-300 mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryNav />

      <main className="max-w-300 mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <ProductImage product={product} />

          {/* Right: Info & Actions */}
          <div className="space-y-6">
            <ProductInfo product={product} />
            <ProductActions productId={product._id} />
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Description
          </h2>
          <div className="text-gray-700 space-y-3">
            <p>
              {product.title} is designed to deliver exceptional performance and
              reliability. Perfect for everyday use with premium quality
              materials and construction.
            </p>
            <p>
              This product combines cutting-edge technology with elegant design,
              making it an ideal choice for those who value both functionality
              and style.
            </p>
            <p>
              Backed by manufacturer warranty and customer support, you can
              purchase with confidence knowing you&apos;re getting authentic,
              high-quality products.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
