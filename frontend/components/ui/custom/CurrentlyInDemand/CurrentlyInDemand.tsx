"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const DEMAND_ITEMS = [
  { id: "diesel", label: "Diesel cars", imageSrc: "/demand/electro.webp", query: "fuel_type=diesel" },
  { id: "new", label: "New cars", imageSrc: "/demand/neu.webp", query: "registration=2026" },
  { id: "city", label: "City cars", imageSrc: "/demand/city.webp", query: "body_type=hatchback" },
  { id: "family", label: "Family cars", imageSrc: "/demand/family.webp", query: "min_doors=5" },
];

const CurrentlyInDemandSearch = () => {
  const router = useRouter();

  return (
    <section className="bg-white rounded-lg border border-[#e2e2e2] shadow-sm px-6 py-4 w-full">
      <h3 className="text-base font-semibold text-[#222] mb-4">Currently in demand</h3>

      <div className="flex justify-between overflow-x-auto pb-1">
        {DEMAND_ITEMS.map((item) => (
          <button key={item.id} type="button" onClick={() => router.push(`/search?${item.query}`)} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden border border-[#e2e2e2]">
              <Image src={item.imageSrc} alt={item.label} width={56} height={56} className="object-cover w-full h-full" />
            </div>

            <span className="text-sm text-[#333] whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CurrentlyInDemandSearch;
