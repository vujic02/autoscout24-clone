"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Fuel, Zap, Leaf, Droplets } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const FUEL_TYPES = [
  { id: "petrol", labelKey: "home.petrol", icon: Fuel, color: "text-orange-500" },
  { id: "diesel", labelKey: "home.diesel", icon: Droplets, color: "text-gray-600" },
  { id: "electric", labelKey: "home.electric", icon: Zap, color: "text-blue-500" },
  { id: "hybrid", labelKey: "home.hybrid", icon: Leaf, color: "text-green-500" },
];

const FuelTypeSearch = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="bg-[#f5f5f5] rounded-lg w-full">
      <h2 className="text-base md:text-lg font-semibold text-[#222] mb-4">{t("home.searchByFuelType")}</h2>

      <div className="flex justify-between gap-4 md:gap-6 overflow-x-auto pb-1 w-full">
        {FUEL_TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(`/search?fuel_type=${item.id}`)}
            className="flex flex-col items-center gap-2 min-w-[72px] focus:outline-none group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-[#e2e2e2] flex items-center justify-center group-hover:shadow-md transition-shadow">
              <item.icon className={`w-7 h-7 md:w-8 md:h-8 ${item.color}`} />
            </div>
            <span className="text-sm md:text-base font-semibold text-[#333] group-hover:text-blue-500 whitespace-nowrap">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FuelTypeSearch;
