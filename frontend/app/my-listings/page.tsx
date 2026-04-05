"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, ArrowLeft, TrendingUp, Package, DollarSign, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  user: number;
}

const MyListingsPage = () => {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem("authUser");
      if (!authUser) {
        router.push("/login");
        return;
      }
      try {
        const user = JSON.parse(authUser);
        setUserId(user.id);
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch("http://127.0.0.1:8000/api/listings/", {
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
        // Filter listings to only show user's own listings
        const allListings = data.results ?? data;
        const myListings = allListings.filter((listing: Listing) => listing.user === userId);
        setListings(myListings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [userId]);

  const handleDelete = async (listingId: number) => {
    setDeletingId(listingId);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`http://127.0.0.1:8000/api/listings/${listingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete listing");
      }

      setListings(listings.filter((listing) => listing.id !== listingId));
      toast.success("Listing deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    if (listings.length === 0) {
      return {
        totalListings: 0,
        averagePrice: 0,
        totalValue: 0,
        mostListedBrand: "N/A",
        brandBreakdown: [],
        fuelTypeBreakdown: [],
      };
    }

    const totalListings = listings.length;
    const totalValue = listings.reduce((sum, listing) => sum + listing.price, 0);
    const averagePrice = Math.round(totalValue / totalListings);

    // Count brands
    const brandCounts: Record<string, number> = {};
    listings.forEach((listing) => {
      brandCounts[listing.make] = (brandCounts[listing.make] || 0) + 1;
    });

    const brandBreakdown = Object.entries(brandCounts)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count);

    const mostListedBrand = brandBreakdown.length > 0 ? brandBreakdown[0].make : "N/A";

    // Count fuel types
    const fuelTypeCounts: Record<string, number> = {};
    listings.forEach((listing) => {
      fuelTypeCounts[listing.fuel_type] = (fuelTypeCounts[listing.fuel_type] || 0) + 1;
    });

    const fuelTypeBreakdown = Object.entries(fuelTypeCounts)
      .map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalListings,
      averagePrice,
      totalValue,
      mostListedBrand,
      brandBreakdown,
      fuelTypeBreakdown,
    };
  }, [listings]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <p className="text-gray-600 mt-2">Manage your vehicle listings</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">{error}</div>}

      {listings.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Listings */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Listings</p>
                <p className="text-3xl font-bold mt-2">{statistics.totalListings}</p>
              </div>
              <Package size={40} className="opacity-20" />
            </div>
          </div>

          {/* Average Price */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Average Price</p>
                <p className="text-3xl font-bold mt-2">€{statistics.averagePrice.toLocaleString()}</p>
              </div>
              <DollarSign size={40} className="opacity-20" />
            </div>
          </div>

          {/* Most Listed Brand */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Most Listed Brand</p>
                <p className="text-3xl font-bold mt-2">{statistics.mostListedBrand}</p>
              </div>
              <TrendingUp size={40} className="opacity-20" />
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold mt-2">€{statistics.totalValue.toLocaleString()}</p>
              </div>
              <Zap size={40} className="opacity-20" />
            </div>
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Breakdown</h3>
            <div className="space-y-3">
              {statistics.brandBreakdown.slice(0, 5).map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.make}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / statistics.totalListings) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fuel Type Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Type Distribution</h3>
            <div className="space-y-3">
              {statistics.fuelTypeBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${idx === 0 ? "bg-green-600" : idx === 1 ? "bg-orange-600" : idx === 2 ? "bg-purple-600" : "bg-gray-600"}`}
                      style={{
                        width: `${(item.count / statistics.totalListings) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">{error}</div>}

      {listings.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">You haven&apos;t created any listings yet.</p>
          <Link href="/add-listing">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
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
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">€{listing.price.toLocaleString()}</p>
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
                    <Link href={`/add-listing?id=${listing.id}`}>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors flex items-center gap-2">
                        <Edit size={18} />
                        Edit
                      </button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={deletingId === listing.id}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {deletingId === listing.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete listing</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete &quot;{listing.title}&quot;? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing.id)} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {listings.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <div>
            <p className="text-gray-600">
              Total listings: <span className="font-bold text-gray-900">{listings.length}</span>
            </p>
          </div>
          <Link href="/add-listing">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add New Listing</Button>
          </Link>
        </div>
      )}
    </main>
  );
};

export default MyListingsPage;
