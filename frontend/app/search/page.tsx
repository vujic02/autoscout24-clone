"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { fetchListings, Listing } from "@/lib/api";
import { cn } from "@/lib/utils";
import { carsModelData } from "@/utils/tabsStatic";
import { customSelectDataDynamic } from "@/types/Home";
import { Sidebar } from "@/components/ui/custom/FilterSidebar/FilterSidebarComponents";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";

type SearchPageProps = {
  searchParams: {
    make?: string;
    model?: string;
    price?: string;
    registration?: string;
    country?: string;
    seller?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Filter state initialized from URL params
  const [selectedMake, setSelectedMake] = useState(searchParams.make || "");
  const [selectedModel, setSelectedModel] = useState(searchParams.model || "");
  const [selectedPrice, setSelectedPrice] = useState(searchParams.price || "");
  const [selectedRegistration, setSelectedRegistration] = useState(searchParams.registration || "");
  const [selectedCountry, setSelectedCountry] = useState(searchParams.country || "");

  const model: customSelectDataDynamic = carsModelData;
  const modelData = model[selectedMake];

  const currentPage = Number(urlSearchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / 15);
  const isFirstRender = useRef(true);

  // When make changes, reset model
  useEffect(() => {
    if (!isFirstRender.current) {
      setSelectedModel("");
    }
  }, [selectedMake]);

  // Auto-update URL when filters change (with debounce)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedMake) params.set("make", selectedMake);
      if (selectedModel) params.set("model", selectedModel);
      if (selectedPrice) params.set("price", selectedPrice);
      if (selectedRegistration) params.set("registration", selectedRegistration);
      if (selectedCountry) params.set("country", selectedCountry);
      // Reset to page 1 when filters change
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedMake, selectedModel, selectedPrice, selectedRegistration, selectedCountry]);

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
        const data = await fetchListings({
          make: searchParams.make,
          model: searchParams.model,
          price: searchParams.price,
          registration: searchParams.registration,
          country: searchParams.country,
          seller: searchParams.seller,
          page: String(currentPage),
        });
        setListings(data.results);
        setTotalCount(data.count);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [searchParams, currentPage]);

  const sidebarProps = {
    modelData,
    selectedMake,
    selectedModel,
    selectedPrice,
    selectedRegistration,
    selectedCountry,
    setSelectedMake,
    setSelectedModel,
    setSelectedPrice,
    setSelectedRegistration,
    setSelectedCountry,
    totalCount,
  };

  return (
    <main className="max-w-[1100px] w-full mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Search results {searchParams.make && `for ${searchParams.make}`}</h1>
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
