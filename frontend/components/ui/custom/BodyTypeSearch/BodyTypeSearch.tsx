"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "@/lib/i18n";

type BodyType = {
  id: string;
  labelKey: string;
  imageSrc: string;
};

const BODY_TYPES: BodyType[] = [
  { id: "hatchback", labelKey: "home.compact", imageSrc: "/body-types/compact.webp" },
  { id: "suv", labelKey: "home.suvPickup", imageSrc: "/body-types/suv.webp" },
  { id: "van", labelKey: "home.transporter", imageSrc: "/body-types/transport.webp" },
  { id: "convertible", labelKey: "home.convertible", imageSrc: "/body-types/convertible.webp" },
  { id: "van", labelKey: "home.van", imageSrc: "/body-types/van.webp" },
  { id: "sedan", labelKey: "home.sedan", imageSrc: "/body-types/sedan.webp" },
  { id: "wagon", labelKey: "home.stationWagon", imageSrc: "/body-types/wagon.webp" },
  { id: "coupe", labelKey: "home.coupe", imageSrc: "/body-types/coupe.webp" },
];

const BodyTypeSearch = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="bg-[#f5f5f5] rounded-lg w-full">
      <h2 className="text-base md:text-lg font-semibold text-[#222] mb-4">{t("home.searchByBodyType")}</h2>

      <div className="flex justify-between gap-4 md:gap-6 overflow-x-auto pb-1 w-full">
        {BODY_TYPES.map((item) => (
          <button
            key={item.id + item.label}
            type="button"
            onClick={() => router.push(`/search?body_type=${item.id}`)}
            className="flex flex-col items-center gap-2 min-w-[72px] focus:outline-none group"
          >
            <div className="w-24 h-16 md:w-28 md:h-20 relative group-hover:translate-y-1 transition-transform">
              <Image src={item.imageSrc} alt={t(item.labelKey)} fill className="object-contain" />
            </div>
            <span className="text-sm md:text-base font-semibold text-[#333] group-hover:text-blue-500 whitespace-nowrap">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BodyTypeSearch;
