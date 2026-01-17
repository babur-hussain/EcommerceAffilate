export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  discount?: number;
}

export const products: Product[] = [
  // Smartphones
  {
    id: "p1",
    title: "Samsung Galaxy S24",
    price: 79999,
    originalPrice: 89999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Galaxy+S24",
    category: "mobiles",
    discount: 11,
  },
  {
    id: "p2",
    title: "iPhone 15 Pro",
    price: 129999,
    originalPrice: 134900,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=iPhone+15",
    category: "mobiles",
    discount: 4,
  },
  {
    id: "p3",
    title: "OnePlus 12",
    price: 64999,
    originalPrice: 69999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=OnePlus+12",
    category: "mobiles",
    discount: 7,
  },
  {
    id: "p4",
    title: "Xiaomi 14 Pro",
    price: 54999,
    originalPrice: 59999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Xiaomi+14",
    category: "mobiles",
    discount: 8,
  },
  {
    id: "p5",
    title: "Google Pixel 8",
    price: 75999,
    originalPrice: 79999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Pixel+8",
    category: "mobiles",
    discount: 5,
  },

  // Electronics
  {
    id: "p6",
    title: "Sony WH-1000XM5 Headphones",
    price: 29990,
    originalPrice: 34990,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Sony+WH",
    category: "electronics",
    discount: 14,
  },
  {
    id: "p7",
    title: "Apple Watch Series 9",
    price: 41900,
    originalPrice: 45900,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Apple+Watch",
    category: "electronics",
    discount: 9,
  },
  {
    id: "p8",
    title: "Samsung 55\" 4K Smart TV",
    price: 54999,
    originalPrice: 64999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Samsung+TV",
    category: "electronics",
    discount: 15,
  },
  {
    id: "p9",
    title: "Dell XPS 15 Laptop",
    price: 139999,
    originalPrice: 149999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Dell+XPS",
    category: "electronics",
    discount: 7,
  },

  // Fashion
  {
    id: "p10",
    title: "Nike Air Max Shoes",
    price: 7995,
    originalPrice: 9995,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Nike+Shoes",
    category: "fashion",
    discount: 20,
  },
  {
    id: "p11",
    title: "Levi's Denim Jacket",
    price: 3499,
    originalPrice: 4999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Levis+Jacket",
    category: "fashion",
    discount: 30,
  },
  {
    id: "p12",
    title: "Adidas T-Shirt",
    price: 1299,
    originalPrice: 1999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Adidas+Tee",
    category: "fashion",
    discount: 35,
  },

  // Home
  {
    id: "p13",
    title: "Wooden Study Table",
    price: 8999,
    originalPrice: 12999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Study+Table",
    category: "home",
    discount: 31,
  },
  {
    id: "p14",
    title: "Office Chair Ergonomic",
    price: 6499,
    originalPrice: 9999,
    image: "https://placehold.co/300x300/e2e8f0/475569?text=Office+Chair",
    category: "home",
    discount: 35,
  },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
