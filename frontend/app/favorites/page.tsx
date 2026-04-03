"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Listing, getFavoriteIds } from "@/lib/api";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";
import Image from "next/image";

const AppPromoSidebar = () => (
  <aside className="hidden lg:block w-[260px] shrink-0">
    <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
      <h3 className="text-base font-bold text-[#222] mb-2">Germany&apos;s best car market app*</h3>
      <p className="text-sm text-[#666] mb-4">Get your dream vehicle quickly and easily – just like millions of enthusiastic users already do.</p>
      <div className="flex justify-center mb-4">
        <Image src="/icons/favorites_teaser.png" alt="AutoScout24 App" width={200} height={150} />
      </div>
      <div className="text-left">
        <p className="font-semibold text-[#222] mb-2" style={{ fontSize: "0.9375rem" }}>
          Stay connected
        </p>
        <a
          href="https://apps.apple.com/us/app/autoscout24-buy-sell-cars/id311785642?mt=8&pt=229724&ct=web2app"
          target="_blank"
          className="flex items-center text-black hover:text-blue-950 font-light mb-3"
          style={{ fontSize: "0.9375rem" }}
        >
          <Image className="mr-2" width={18} height={22} src="/icons/ios-icon.svg" alt="" />
          AutoScout24 for iOS
        </a>
        <a
          href="https://apps.apple.com/us/app/autoscout24-buy-sell-cars/id311785642?mt=8&pt=229724&ct=web2app"
          target="_blank"
          className="flex items-center text-black hover:text-blue-950 font-light"
          style={{ fontSize: "0.9375rem" }}
        >
          <Image className="mr-2" width={18} height={22} src="/icons/android-icon.svg" alt="" />
          AutoScout24 for Android
        </a>
      </div>
    </div>
  </aside>
);

const NotepadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
    <rect x="15" y="20" width="50" height="45" rx="4" stroke="#222" strokeWidth="2.5" fill="none" />
    <rect x="20" y="12" width="8" height="14" rx="2" stroke="#222" strokeWidth="2" fill="white" />
    <rect x="36" y="12" width="8" height="14" rx="2" stroke="#222" strokeWidth="2" fill="white" />
    <rect x="52" y="12" width="8" height="14" rx="2" stroke="#222" strokeWidth="2" fill="white" />
    <circle cx="40" cy="42" r="8" stroke="#222" strokeWidth="2" fill="none" />
    <path d="M40 38v4l2.5 2.5" stroke="#222" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

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
    <main className="max-w-[1100px] w-full mx-auto py-8">
      <div className="flex gap-6">
        <AppPromoSidebar />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-6">
            <h1 className="text-2xl font-bold text-[#222]">Favorites</h1>
            {!loading && (
              <span className="text-sm text-[#666]">
                {listings.length} {listings.length === 1 ? "vehicle" : "vehicles"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-[#222] text-center mb-6">Your notepad is empty.</h2>
              <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-[#1166a8] shrink-0" />
                    <span className="text-sm text-[#666]">Be reliably informed about price reductions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-[#1166a8] shrink-0" />
                    <span className="text-sm text-[#666]">Don&apos;t miss special offers on certain models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={18} className="text-[#1166a8] shrink-0" />
                    <span className="text-sm text-[#666]">Compare vehicles easily and clearly</span>
                  </div>
                  <button
                    onClick={() => router.push("/search")}
                    className="mt-4 bg-[#1166a8] text-white px-6 py-2.5 rounded-md hover:bg-[#0f5790] transition-colors text-sm font-medium w-fit"
                  >
                    Start search
                  </button>
                </div>
                <div className="hidden sm:block shrink-0">
                  <NotepadIcon />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <VehicleSearchedResult key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
