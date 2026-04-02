"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VehicleCard from "../VehicleCard/VehicleCard";
import { Listing, fetchListings, fetchFavoriteIds } from "@/lib/api";

const FeaturedVehicles = () => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadFeaturedListings = async () => {
      try {
        setLoading(true);
        const [data, favIds] = await Promise.all([fetchListings({ featured: "true" }), fetchFavoriteIds()]);
        setListings(data.results.slice(0, 4));
        const favMap: Record<number, boolean> = {};
        favIds.forEach((id) => (favMap[id] = true));
        setFavorites(favMap);
        setError("");
      } catch (err) {
        console.error("Failed to fetch featured listings:", err);
        setError("Failed to load featured vehicles");
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedListings();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Featured Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Featured Vehicles</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (listings.length === 0) {
    return null; // Don't show section if no featured vehicles
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Featured Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <VehicleCard
            key={listing.id}
            listingId={listing.id}
            registration={new Date(listing.registration_year, 0, 1)}
            fuelType={listing.fuel_type as "Gasoline" | "Diesel"}
            kilometerage={listing.mileage}
            price={listing.price}
            name={`${listing.make} ${listing.model}`}
            location={listing.city}
            image={listing.main_image || undefined}
            favorite={favorites[listing.id] || false}
            onFavoriteToggle={(id, newState) => {
              setFavorites((prev) => ({ ...prev, [id]: newState }));
            }}
            onClick={() => router.push(`/vehicle/${listing.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedVehicles;
