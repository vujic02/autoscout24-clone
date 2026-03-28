"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Trash2, ArrowLeft, LogOut, TrendingUp, Package, DollarSign, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [brandAveragePrices, setBrandAveragePrices] = useState<Array<{ make: string; average_price: number; count: number }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterById, setFilterById] = useState("");
  const [filterByMake, setFilterByMake] = useState("");
  const [filterByModel, setFilterByModel] = useState("");
  const ITEMS_PER_PAGE = 10;

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

  const fetchAdminListings = useCallback(async (filters?: { id?: string; make?: string; model?: string }, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setFilterLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const params = new URLSearchParams();
      if (filters?.id) params.set("id", filters.id);
      if (filters?.make) params.set("make", filters.make);
      if (filters?.model) params.set("model", filters.model);
      const query = params.toString();

      const res = await fetch(`http://127.0.0.1:8000/api/admin/listings/${query ? `?${query}` : ""}`, {
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
      setListings(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchBrandPrices = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
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
        console.error("Failed to fetch brand prices:", err);
      }
    };

    fetchAdminListings(undefined, true);
    fetchBrandPrices();
  }, [isAdmin, fetchAdminListings]);

  // Debounced fetch when filters change
  useEffect(() => {
    if (!isAdmin) return;
    const hasFilters = filterById || filterByMake || filterByModel;
    if (!hasFilters && listings.length > 0) return; // skip if no filters and already loaded

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      fetchAdminListings({ id: filterById, make: filterByMake, model: filterByModel });
    }, 400);

    return () => clearTimeout(timeout);
  }, [filterById, filterByMake, filterByModel, isAdmin, fetchAdminListings]);

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

  const hasActiveFilters = filterById || filterByMake || filterByModel;

  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const paginatedListings = listings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    <main className="max-w-[1100px] mx-auto py-8 px-4">
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
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#f5f200] text-[#1c1c2e] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#1c1c2e]/70 text-sm font-medium">Total Listings</p>
              <p className="text-3xl font-bold mt-2">{statistics.totalListings}</p>
            </div>
            <Package size={40} className="opacity-20" />
          </div>
        </div>

        <div className="bg-[#1c1c2e] text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Average Price</p>
              <p className="text-3xl font-bold mt-2">€{statistics.averagePrice.toLocaleString()}</p>
            </div>
            <DollarSign size={40} className="opacity-20" />
          </div>
        </div>

        <div className="bg-[#f5f200] text-[#1c1c2e] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#1c1c2e]/70 text-sm font-medium">Featured</p>
              <p className="text-3xl font-bold mt-2">{statistics.featuredCount}</p>
            </div>
            <Star size={40} className="opacity-20" />
          </div>
        </div>

        <div className="bg-[#1c1c2e] text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Total Value</p>
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
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${(statistics.priceRanges.low / statistics.totalListings) * 251.2} 251.2`}
                />
                {/* Mid price segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f5f200"
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
                  stroke="#22c55e"
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
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  €0 - €10k: {statistics.priceRanges.low} ({Math.round((statistics.priceRanges.low / statistics.totalListings) * 100)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f5f200] rounded-full"></div>
                <span className="text-sm text-gray-700">
                  €10k - €50k: {statistics.priceRanges.mid} ({Math.round((statistics.priceRanges.mid / statistics.totalListings) * 100)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
              const colors = ["bg-blue-600", "bg-green-600", "bg-red-600", "bg-gray-600"];
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
                    className="bg-[#1c1c2e] h-2 rounded-full"
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
                    className="bg-[#1c1c2e] h-2 rounded-full"
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
                <div key={brand.make} className="flex flex-col items-center gap-2" style={{ width: "60px" }}>
                  <div className="text-xs font-bold text-[#1c1c2e] h-5 flex items-end">€{brand.average_price.toLocaleString()}</div>
                  <div className="flex flex-col items-center justify-end" style={{ height: "200px" }}>
                    <div className="w-12 bg-[#1c1c2e] rounded-t-lg hover:bg-[#2a2a3e] transition-all cursor-pointer" style={{ height: `${barHeight}%` }}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center w-full whitespace-nowrap">{brand.make}</span>
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

      {/* Sidebar + Listings Layout */}
      <div className="mt-8 flex gap-6">
        {/* Mobile filter trigger */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger className="flex items-center gap-2 bg-[#1c1c2e] text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium">
              <SlidersHorizontal size={16} /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-[#f5f200] rounded-full"></span>}
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px]">
              <AdminFilterSidebar
                filterById={filterById}
                filterByMake={filterByMake}
                filterByModel={filterByModel}
                setFilterById={setFilterById}
                setFilterByMake={setFilterByMake}
                setFilterByModel={setFilterByModel}
                resultCount={listings.length}
                featuredCount={listings.filter((l) => l.featured).length}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:block w-[260px] flex-shrink-0">
          <div className="sticky top-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <AdminFilterSidebar
              filterById={filterById}
              filterByMake={filterByMake}
              filterByModel={filterByModel}
              setFilterById={setFilterById}
              setFilterByMake={setFilterByMake}
              setFilterByModel={setFilterByModel}
              resultCount={listings.length}
              featuredCount={listings.filter((l) => l.featured).length}
            />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {listings.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">No listings found.</p>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilterById("");
                    setFilterByMake("");
                    setFilterByModel("");
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className={`space-y-3 transition-opacity ${filterLoading ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center justify-between text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div>
                  Showing{" "}
                  <span className="font-bold">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, listings.length)}
                  </span>{" "}
                  of <span className="font-bold">{listings.length}</span> listings
                </div>
                <div>
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              {paginatedListings.map((listing) => (
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
                            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">⭐ Featured</span>
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage ? "bg-[#1c1c2e] text-white" : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

function AdminFilterSidebar({
  filterById,
  filterByMake,
  filterByModel,
  setFilterById,
  setFilterByMake,
  setFilterByModel,
  resultCount,
  featuredCount,
}: {
  filterById: string;
  filterByMake: string;
  filterByModel: string;
  setFilterById: (v: string) => void;
  setFilterByMake: (v: string) => void;
  setFilterByModel: (v: string) => void;
  resultCount: number;
  featuredCount: number;
}) {
  const hasActiveFilters = filterById || filterByMake || filterByModel;
  const activeCount = [filterById, filterByMake, filterByModel].filter(Boolean).length;

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-base text-[#333] font-semibold flex items-center gap-2">
          <Search size={16} />
          Filter listings{activeCount > 0 && ` (${activeCount})`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setFilterById("");
              setFilterByMake("");
              setFilterByModel("");
            }}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        {resultCount} listing{resultCount !== 1 ? "s" : ""} found | {featuredCount} featured
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Listing ID</label>
          <input
            type="text"
            value={filterById}
            onChange={(e) => setFilterById(e.target.value)}
            placeholder="Search by ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
          <input
            type="text"
            value={filterByMake}
            onChange={(e) => setFilterByMake(e.target.value)}
            placeholder="Search by make..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={filterByModel}
            onChange={(e) => setFilterByModel(e.target.value)}
            placeholder="Search by model..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
