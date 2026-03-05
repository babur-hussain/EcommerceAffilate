import type { Metadata } from "next";
import SellerProgramPage from "@/components/sell/SellerProgramPage";

export const metadata: Metadata = {
  title: "Sell on Local For Vocal — India's Influencer-Powered Marketplace",
  description:
    "Start selling on Local For Vocal with just 2-5% commission. Get influencer-driven marketing, fast payouts, and nationwide reach. Join 10,000+ sellers today.",
  keywords: [
    "sell online",
    "local for vocal",
    "ecommerce marketplace",
    "low commission",
    "influencer marketing",
    "sell products online india",
  ],
};

export default function SellPage() {
  return <SellerProgramPage />;
}
