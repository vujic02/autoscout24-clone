"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Trash2, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Listing {
  id: number;
  title: string;
  make: string;
  model: string;
  price: number;
  main_image: string;
  year: number;
  mileage: number;
  fuel_type: string;
  country: string;
  city: string;
  featured: boolean;
  user: number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("authToken");
      const authUser = localStorage.getItem("authUser");

      if (!token || !authUser) {
        router.push("/login");
        return;
      }

      try {
        // Verify admin status with backend
        const res = await fetch("http://127.0.0.1:8000/api/auth/current-user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const userData = await res.json();
        if (!userData.is_staff) {
          router.push("/");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error("Failed to verify admin status:", err);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch("http://127.0.0.1:8000/api/admin/listings/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await res.json();
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [isAdmin]);

  const handleToggleFeatured = async (listingId: number, currentFeatured: boolean) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`http://127.0.0.1:8000/api/admin/listings/${listingId}/toggle-featured/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to toggle featured status");
      }

      const updatedListing = await res.json();
      setListings(listings.map((listing) => (listing.id === listingId ? updatedListing : listing)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle featured");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("isAdmin");
    router.push("/");
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1100px] mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.back()} className=" hover:bg-gray-100 rounded-lg transition-colors" title="Back">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage all listings and mark featured items</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">{error}</div>}

      {listings.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No listings available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mb-4 text-sm text-gray-600">
            Total listings: <span className="font-bold">{listings.length}</span> | Featured:{" "}
            <span className="font-bold">{listings.filter((l) => l.featured).length}</span>
          </div>

          {listings.map((listing) => (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Image */}
                <div className="flex-shrink-0 w-full md:w-48 h-48 relative bg-gray-100 rounded-lg overflow-hidden">
                  {listing.main_image ? (
                    <Image src={listing.main_image} alt={`${listing.make} ${listing.model}`} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {listing.year} {listing.make} {listing.model}
                      </h2>
                      <p className="text-gray-600">{listing.title}</p>
                      <p className="text-gray-500 text-sm mt-1">User ID: {listing.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">€{listing.price.toLocaleString()}</p>
                      {listing.featured && (
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 text-sm">
                    <div>
                      <p className="text-gray-600">Mileage</p>
                      <p className="font-semibold">{listing.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fuel Type</p>
                      <p className="font-semibold">{listing.fuel_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-semibold">
                        {listing.city}, {listing.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Listing ID</p>
                      <p className="font-semibold">#{listing.id}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link href={`/vehicle/${listing.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Listing
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(listing.id, listing.featured)}
                      className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 font-medium ${
                        listing.featured ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-900" : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <Star size={18} className={listing.featured ? "fill-yellow-500" : ""} />
                      {listing.featured ? "Remove Featured" : "Mark Featured"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
