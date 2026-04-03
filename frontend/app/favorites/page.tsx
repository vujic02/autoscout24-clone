"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft } from "lucide-react";
import { Listing, getFavoriteIds } from "@/lib/api";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";

export default function FavoritesPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    const ids = getFavoriteIds();
    if (ids.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }
    try {
      const results = await Promise.all(
        ids.map((id) =>
          fetch(`http://127.0.0.1:8000/api/listings/${id}/`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ),
      );
      setListings(results.filter(Boolean) as Listing[]);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favoritesChange", loadFavorites);
    return () => window.removeEventListener("favoritesChange", loadFavorites);
  }, [loadFavorites]);

  return (
    <main className="max-w-[1100px] w-full mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">My Favorites</h1>
        <span className="text-sm text-gray-500">({listings.length} vehicles)</span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-400 mb-6">Start browsing and save vehicles you like</p>
          <button onClick={() => router.push("/search")} className="bg-[#1c1c2e] text-white px-6 py-2 rounded-lg hover:bg-[#2c2c3e] transition-colors">
            Browse vehicles
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <VehicleSearchedResult key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
