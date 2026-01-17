import { BackendProduct } from "@/types/product";
import Image from "next/image";

interface ProductImageProps {
  product: BackendProduct;
}

export default function ProductImage({ product }: ProductImageProps) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
