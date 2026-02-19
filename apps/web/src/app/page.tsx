import HomeContent from "@/components/homepage/HomeContent";
import type { HomepageSection } from "@/hooks/useHomepageSections";

const BACKEND_URL = process.env.BACKEND_URL || "https://api.lfvs.in";

async function getHomepageSections(): Promise<HomepageSection[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/homepage/sections`, {
      next: { revalidate: 60 }, // Cache for 60 seconds on the server
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const sections = await getHomepageSections();

  return <HomeContent sections={sections} />;
}
