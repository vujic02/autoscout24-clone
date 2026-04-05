"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { fetchListings, Listing, saveLastSearch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { carsModelData } from "@/utils/tabsStatic";
import { customSelectDataDynamic, SearchFilters } from "@/types/Home";
import { Sidebar } from "@/components/ui/custom/FilterSidebar/FilterSidebarComponents";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Filter state initialized from URL params
  const [filters, setFilters] = useState<SearchFilters>({
    make: urlSearchParams.get("make") || "",
    model: urlSearchParams.get("model") || "",
    price: urlSearchParams.get("price") || "",
    registration: urlSearchParams.get("registration") || "",
    country: urlSearchParams.get("country") || "",
    fuel_type: urlSearchParams.get("fuel_type") || "",
    body_type: urlSearchParams.get("body_type") || "",
    transmission: urlSearchParams.get("transmission") || "",
    drive_type: urlSearchParams.get("drive_type") || "",
    exterior_color: urlSearchParams.get("exterior_color") || "",
    mileage_from: urlSearchParams.get("mileage_from") || "",
    mileage_to: urlSearchParams.get("mileage_to") || "",
    hp_from: urlSearchParams.get("hp_from") || "",
    hp_to: urlSearchParams.get("hp_to") || "",
    sort: urlSearchParams.get("sort") || "",
  });
  const [sortOpen, setSortOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const model: customSelectDataDynamic = carsModelData;
  const modelData = model[filters.make];

  const currentPage = Number(urlSearchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / 15);
  const isFirstRender = useRef(true);

  // When make changes, reset model
  useEffect(() => {
    if (!isFirstRender.current) {
      updateFilter("model", "");
    }
  }, [filters.make]);

  // Auto-update URL when filters change (with debounce)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      // Add all non-empty filter values to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      // Preserve filters not managed by sidebar state
      const seller = urlSearchParams.get("seller");
      const minDoors = urlSearchParams.get("min_doors");
      if (seller) params.set("seller", seller);
      if (minDoors) params.set("min_doors", minDoors);
      // Reset to page 1 when filters change
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters]);

  const setCurrentPage = useCallback(
    (page: number | ((prev: number) => number)) => {
      const newPage = typeof page === "function" ? page(currentPage) : page;
      const params = new URLSearchParams(urlSearchParams.toString());
      if (newPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(newPage));
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [currentPage, urlSearchParams, pathname, router],
  );

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const filters = {
          make: urlSearchParams.get("make") || undefined,
          model: urlSearchParams.get("model") || undefined,
          price: urlSearchParams.get("price") || undefined,
          registration: urlSearchParams.get("registration") || undefined,
          country: urlSearchParams.get("country") || undefined,
          seller: urlSearchParams.get("seller") || undefined,
          fuel_type: urlSearchParams.get("fuel_type") || undefined,
          body_type: urlSearchParams.get("body_type") || undefined,
          transmission: urlSearchParams.get("transmission") || undefined,
          drive_type: urlSearchParams.get("drive_type") || undefined,
          exterior_color: urlSearchParams.get("exterior_color") || undefined,
          mileage_from: urlSearchParams.get("mileage_from")?.replace(/,/g, "") || undefined,
          mileage_to: urlSearchParams.get("mileage_to")?.replace(/,/g, "") || undefined,
          hp_from: urlSearchParams.get("hp_from") || undefined,
          hp_to: urlSearchParams.get("hp_to") || undefined,
          min_doors: urlSearchParams.get("min_doors") || undefined,
          sort: urlSearchParams.get("sort") || undefined,
          page: String(currentPage),
        };
        const data = await fetchListings(filters);
        setListings(data.results);
        setTotalCount(data.count);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);

        // Save this search to localStorage
        const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== "page");
        if (activeFilters.length > 0) {
          const parts: string[] = [];
          if (filters.make) parts.push(filters.make);
          if (filters.model) parts.push(filters.model);
          if (filters.body_type) parts.push(filters.body_type);
          if (filters.fuel_type) parts.push(filters.fuel_type);
          const label = parts.length > 0 ? parts.join(" ") : "All vehicles";
          const subtitleParts: string[] = [];
          if (filters.price) subtitleParts.push(`up to €${filters.price}`);
          if (filters.registration) subtitleParts.push(`from ${filters.registration}`);
          if (filters.country) subtitleParts.push(filters.country);
          subtitleParts.push(`${data.count} results`);

          saveLastSearch({
            query: filters,
            label,
            subtitle: subtitleParts.join(" · "),
            thumbnails: data.results.slice(0, 4).map((l) => l.main_image || ""),
          });
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [urlSearchParams, currentPage]);

  const sidebarProps = {
    modelData,
    filters,
    updateFilter,
    totalCount,
  };

  const sortOptions = [
    { value: "", label: "Best results" },
    { value: "price_asc", label: "Price (lowest)" },
    { value: "price_desc", label: "Price (highest)" },
    { value: "newest", label: "Newest" },
    { value: "mileage_asc", label: "Mileage (lowest)" },
    { value: "year_desc", label: "Year (newest)" },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === filters.sort)?.label || "Best results";

  return (
    <main className="max-w-[1100px] w-full mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Search results {urlSearchParams.get("make") && `for ${urlSearchParams.get("make")}`}</h1>
        <span className="text-sm text-gray-500">({totalCount} vehicles found)</span>
      </div>

      <div className="flex gap-6">
        {/* Mobile filter trigger */}
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger className="flex items-center gap-2 bg-[#333] text-white px-3 py-2 rounded-md text-sm">
              <SlidersHorizontal width={16} height={16} /> Filters
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[320px]">
              <Sidebar {...sidebarProps} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden md:block w-[240px] flex-shrink-0">
          <div className="sticky top-4 border border-gray-200 rounded-lg overflow-hidden">
            <Sidebar {...sidebarProps} />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results header with count and sort */}
          <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-sm">
              <span className="font-bold text-[#333]">{totalCount} Offers</span> <span className="text-gray-500">for your search</span>
            </p>
            <div className="relative">
              <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1 text-sm text-[#1166a8] font-medium hover:underline">
                Sort: {currentSortLabel}
                <ChevronDown size={14} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[180px]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateFilter("sort", opt.value);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "block w-full text-left px-4 py-2 text-sm hover:bg-gray-50",
                        opt.value === filters.sort ? "text-[#1166a8] font-medium" : "text-[#333]",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ) : listings.length === 0 ? (
            <p className="text-sm text-gray-500">No vehicles found for this filter.</p>
          ) : (
            <>
              <div className="space-y-4">
                {listings.map((listing) => (
                  <VehicleSearchedResult key={listing.id} listing={listing} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={!hasPrevious}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                      .map((page, idx, arr) => (
                        <span key={page} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-1 text-gray-400">...</span>}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                              page === currentPage ? "bg-[#1c1c2e] text-white" : "hover:bg-gray-100",
                            )}
                          >
                            {page}
                          </button>
                        </span>
                      ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!hasNext}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
