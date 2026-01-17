import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddressManagement from "./AddressManagement";

interface Address {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

async function getAddresses(token: string): Promise<Address[]> {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";
    const res = await fetch(`${API_BASE}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.addresses || [];
  } catch {
    return [];
  }
}

export default async function AddressesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // If no token, redirect to login with this page as redirect target
  if (!token) {
    redirect("/login?redirect=" + encodeURIComponent("/account/addresses"));
  }

  const addresses = await getAddresses(token);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Addresses</h1>
      <AddressManagement initialAddresses={addresses} />
    </div>
  );
}
