"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft } from "lucide-react";
import { Listing, fetchFavoriteListings, removeFavorite } from "@/lib/api";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";

export default function FavoritesPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoggedIn(true);

    const loadFavorites = async () => {
      try {
        const data = await fetchFavoriteListings();
        setListings(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [router]);

  const handleRemove = async (listingId: number) => {
    await removeFavorite(listingId);
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  };

  if (!isLoggedIn) return null;

  return (
    <main className="max-w-[1100px] w-full mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
          <ArrowLeft size={20} />
        </button>
        <Heart className="fill-black" size={24} />
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
            <div key={listing.id} className="relative">
              <VehicleSearchedResult listing={listing} />
              <button
                onClick={() => handleRemove(listing.id)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                title="Remove from favorites"
              >
                <Heart size={20} className="fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
