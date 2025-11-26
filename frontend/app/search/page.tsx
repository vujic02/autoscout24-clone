"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchListings, Listing } from "@/lib/api";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";

type SearchPageProps = {
  searchParams: {
    make?: string;
    model?: string;
    price?: string;
    registration?: string;
    country?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const data = await fetchListings({
          make: searchParams.make,
          model: searchParams.model,
          price: searchParams.price,
          registration: searchParams.registration,
          country: searchParams.country,
        });
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="max-w-[1100px] w-full mx-auto py-8 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1100px] w-full mx-auto py-8 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Search results {searchParams.make && `for ${searchParams.make}`}</h1>
      </div>

      {listings.length === 0 && <p className="text-sm text-gray-500">No vehicles found for this filter.</p>}

      <div className="space-y-4">
        {listings.map((listing) => (
          <VehicleSearchedResult key={listing.id} listing={listing} />
        ))}
      </div>
    </main>
  );
}
