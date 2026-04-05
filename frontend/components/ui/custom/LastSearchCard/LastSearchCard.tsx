"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import type { LastSearch } from "@/lib/api";

const SUGGESTION_BRANDS = ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Porsche", "Volvo", "Ford"];

const CarSearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" aria-hidden="true">
    <path
      fill="#333"
      d="M23 0a16 16 0 1 1-10.57 28l-9.75 9.72a1 1 0 1 1-1.41-1.41L11 26.57A16 16 0 0 1 23 0m0 2C15.268 2 9 8.268 9 16s6.268 14 14 14a14 14 0 0 0 14-14c0-7.732-6.268-14-14-14m1.44 6a2 2 0 0 1 1.71 1l2.42 4H30a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2h-1.19a3 3 0 0 1-5.63 0h-4.37a3 3 0 0 1-5.63 0H14a2 2 0 0 1-2-2v-5.73a2 2 0 0 1 .29-1L14.86 9a2 2 0 0 1 1.71-1zM18 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3.56-10h-7.87l-1.8 3H17a1 1 0 0 1 0 2h-3v5h1.19a3 3 0 0 1 5.63 0h4.37a3 3 0 0 1 5.63 0H32v-3a2 2 0 0 0-2-2h-2a1 1 0 0 1-.85-.49zM23 12a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1"
    ></path>
  </svg>
);

const CarPlaceholderIcon = () => (
  <svg viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg" width="24">
    <path
      d="M12.5 0c.7 0 1.3.4 1.7 1l2.4 4H18c2.2 0 4 1.8 4 4v3c0 1.1-.9 2-2 2h-1.2c-.4 1.2-1.5 2-2.8 2-1.3 0-2.4-.8-2.8-2H8.8c-.4 1.2-1.5 2-2.8 2-1.3 0-2.4-.8-2.8-2H2c-1.1 0-2-.9-2-2V6.3c0-.3.1-.7.3-1L2.9 1c.3-.6 1-1 1.7-1Z"
      fill="#bbb"
      fillRule="nonzero"
    />
  </svg>
);

const LastSearchCard: React.FC<{ search?: LastSearch }> = ({ search }) => {
  const router = useRouter();
  const [suggestedBrand, setSuggestedBrand] = useState(SUGGESTION_BRANDS[0]);
  const [suggestionThumbnails, setSuggestionThumbnails] = useState<string[]>([]);

  useEffect(() => {
    const brand = SUGGESTION_BRANDS[Math.floor(Math.random() * SUGGESTION_BRANDS.length)];
    setSuggestedBrand(brand);

    if (!search) {
      fetch(`http://127.0.0.1:8000/api/listings/?make=${encodeURIComponent(brand)}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          const imgs = (data.results || []).slice(0, 3).map((l: any) => l.main_image || "");
          setSuggestionThumbnails(imgs);
        })
        .catch(() => {});
    }
  }, [search]);

  const handleClick = () => {
    if (search) {
      const params = new URLSearchParams();
      Object.entries(search.query).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
      router.push(`/search?${params.toString()}`);
    } else {
      router.push(`/search?make=${encodeURIComponent(suggestedBrand)}`);
    }
  };

  const label = search ? search.label : `Try searching for ${suggestedBrand}`;
  const subtitle = search ? search.subtitle : "Discover vehicles on the marketplace";
  const headerLabel = search ? "Recent search" : "Search suggestion";

  return (
    <section className="flex flex-col bg-white rounded-lg border border-[#e2e2e2] shadow-sm w-full">
      <div className="flex items-center gap-4 p-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-md bg-[#f5f5f5] shrink-0">
          <span className="text-3xl">
            <CarSearchIcon />
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs text-[#666]">{headerLabel}</span>
          <span className="text-base font-semibold text-[#222] truncate">{label}</span>
          <span className="text-xs text-[#666] truncate">{subtitle}</span>
        </div>
      </div>

      <div className="border-t border-[#e2e2e2] flex items-center h-full px-4 py-1">
        <div className="flex -space-x-1">
          {(search ? search.thumbnails.slice(0, 3) : suggestionThumbnails).map((src, idx) => (
            <div key={idx} className="w-12 h-12 rounded-sm overflow-hidden border-2 border-white bg-[#ddd]">
              {src ? (
                <img src={src} alt={`Result ${idx + 1}`} width={48} height={48} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#eaeaea]">
                  <CarPlaceholderIcon />
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="button" onClick={handleClick} className="text-xs md:text-sm text-[#1166a8] font-medium hover:text-[#0f5790] ml-4">
          {search ? "More results" : "Search now"}
        </button>
      </div>
    </section>
  );
};

export default LastSearchCard;
