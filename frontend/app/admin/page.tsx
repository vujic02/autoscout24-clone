"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Trash2, ArrowLeft, LogOut, TrendingUp, Package, DollarSign, AlertCircle } from "lucide-react";
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
  const [brandAveragePrices, setBrandAveragePrices] = useState<Array<{ make: string; average_price: number; count: number }>>([]);

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

        // Fetch brand average prices from backend
        const brandPricesRes = await fetch("http://127.0.0.1:8000/api/admin/brand-average-prices/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (brandPricesRes.ok) {
          const brandPricesData = await brandPricesRes.json();
          setBrandAveragePrices(brandPricesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [isAdmin]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (listings.length === 0) {
      return {
        totalListings: 0,
        averagePrice: 0,
        totalValue: 0,
        featuredCount: 0,
        brandBreakdown: [],
        fuelTypeBreakdown: [],
        countryBreakdown: [],
        priceRanges: { low: 0, mid: 0, high: 0 },
      };
    }

    const totalListings = listings.length;
    const totalValue = listings.reduce((sum, listing) => sum + listing.price, 0);
    const averagePrice = Math.round(totalValue / totalListings);
    const featuredCount = listings.filter((l) => l.featured).length;

    // Brand breakdown
    const brandCounts: Record<string, number> = {};
    listings.forEach((listing) => {
      brandCounts[listing.make] = (brandCounts[listing.make] || 0) + 1;
    });
    const brandBreakdown = Object.entries(brandCounts)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count);

    // Fuel type breakdown
    const fuelTypeCounts: Record<string, number> = {};
    listings.forEach((listing) => {
      fuelTypeCounts[listing.fuel_type] = (fuelTypeCounts[listing.fuel_type] || 0) + 1;
    });
    const fuelTypeBreakdown = Object.entries(fuelTypeCounts)
      .map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), count }))
      .sort((a, b) => b.count - a.count);

    // Country breakdown
    const countryCounts: Record<string, number> = {};
    listings.forEach((listing) => {
      countryCounts[listing.country] = (countryCounts[listing.country] || 0) + 1;
    });
    const countryBreakdown = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Price ranges
    const priceRanges = {
      low: listings.filter((l) => l.price < 10000).length,
      mid: listings.filter((l) => l.price >= 10000 && l.price < 50000).length,
      high: listings.filter((l) => l.price >= 50000).length,
    };

    return {
      totalListings,
      averagePrice,
      totalValue,
      featuredCount,
      brandBreakdown,
      fuelTypeBreakdown,
      countryBreakdown,
      priceRanges,
    };
  }, [listings]);

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
          <p className="text-gray-600">Manage and monitor all listings</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Listings</p>
              <p className="text-3xl font-bold mt-2">{statistics.totalListings}</p>
            </div>
            <Package size={40} className="opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Average Price</p>
              <p className="text-3xl font-bold mt-2">€{statistics.averagePrice.toLocaleString()}</p>
            </div>
            <DollarSign size={40} className="opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Featured</p>
              <p className="text-3xl font-bold mt-2">{statistics.featuredCount}</p>
            </div>
            <Star size={40} className="opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold mt-2">€{(statistics.totalValue / 1000000).toFixed(1)}M</p>
            </div>
            <TrendingUp size={40} className="opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Range Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Range Distribution</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Low price segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray={`${(statistics.priceRanges.low / statistics.totalListings) * 251.2} 251.2`}
                />
                {/* Mid price segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${(statistics.priceRanges.mid / statistics.totalListings) * 251.2} 251.2`}
                  strokeDashoffset={-((statistics.priceRanges.low / statistics.totalListings) * 251.2)}
                />
                {/* High price segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={`${(statistics.priceRanges.high / statistics.totalListings) * 251.2} 251.2`}
                  strokeDashoffset={-(((statistics.priceRanges.low + statistics.priceRanges.mid) / statistics.totalListings) * 251.2)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{statistics.totalListings}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  €0 - €10k: {statistics.priceRanges.low} ({Math.round((statistics.priceRanges.low / statistics.totalListings) * 100)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  €10k - €50k: {statistics.priceRanges.mid} ({Math.round((statistics.priceRanges.mid / statistics.totalListings) * 100)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  €50k+: {statistics.priceRanges.high} ({Math.round((statistics.priceRanges.high / statistics.totalListings) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel Type Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fuel Type Distribution</h3>
          <div className="space-y-3">
            {statistics.fuelTypeBreakdown.map((item, idx) => {
              const colors = ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-gray-600"];
              return (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <span className="text-sm text-gray-600">
                      {item.count} ({Math.round((item.count / statistics.totalListings) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${colors[idx % colors.length]} h-3 rounded-full`}
                      style={{
                        width: `${(item.count / statistics.totalListings) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Brands Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Brands</h3>
          <div className="space-y-3">
            {statistics.brandBreakdown.slice(0, 8).map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.make}</span>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / statistics.brandBreakdown[0].count) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Countries</h3>
          <div className="space-y-3">
            {statistics.countryBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.country}</span>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / statistics.countryBreakdown[0].count) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line Graph - Average Price by Brand */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Price by Brand</h3>
        <div className="overflow-x-auto">
          <div className="flex items-end justify-start gap-4 p-4 min-w-max" style={{ height: "300px" }}>
            {brandAveragePrices.slice(0, 12).map((brand) => {
              const maxPrice = Math.max(...brandAveragePrices.slice(0, 12).map((b) => b.average_price));
              const barHeight = (brand.average_price / maxPrice) * 100;

              return (
                <div key={brand.make} className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center justify-end" style={{ height: "220px" }}>
                    <div className="text-xs font-bold text-blue-600 mb-1">€{brand.average_price.toLocaleString()}</div>
                    <div
                      className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${barHeight}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center w-12 break-words">{brand.make}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-600 px-4">
          <span>Y-Axis: Average Price (€)</span>
          <span>X-Axis: Top 12 Brands</span>
        </div>
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
