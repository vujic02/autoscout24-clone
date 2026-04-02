"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type BodyType = {
  id: string;
  label: string;
  imageSrc: string;
};

const BODY_TYPES: BodyType[] = [
  { id: "hatchback", label: "Compact", imageSrc: "/body-types/compact.webp" },
  { id: "suv", label: "SUV & Pick-up", imageSrc: "/body-types/suv.webp" },
  { id: "van", label: "Transporter", imageSrc: "/body-types/transport.webp" },
  { id: "convertible", label: "Convertible", imageSrc: "/body-types/convertible.webp" },
  { id: "van", label: "Van", imageSrc: "/body-types/van.webp" },
  { id: "sedan", label: "Sedan", imageSrc: "/body-types/sedan.webp" },
  { id: "wagon", label: "Station wagon", imageSrc: "/body-types/wagon.webp" },
  { id: "coupe", label: "Coupe", imageSrc: "/body-types/coupe.webp" },
];

const BodyTypeSearch = () => {
  const router = useRouter();

  return (
    <section className="bg-[#f5f5f5] rounded-lg w-full">
      <h2 className="text-base md:text-lg font-semibold text-[#222] mb-4">Search by body type</h2>

      <div className="flex justify-between gap-4 md:gap-6 overflow-x-auto pb-1 w-full">
        {BODY_TYPES.map((item) => (
          <button
            key={item.id + item.label}
            type="button"
            onClick={() => router.push(`/search?body_type=${item.id}`)}
            className="flex flex-col items-center gap-2 min-w-[72px] focus:outline-none group"
          >
            <div className="w-24 h-16 md:w-28 md:h-20 relative group-hover:translate-y-1 transition-transform">
              <Image src={item.imageSrc} alt={item.label} fill className="object-contain" />
            </div>
            <span className="text-sm md:text-base font-semibold text-[#333] group-hover:text-blue-500 whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BodyTypeSearch;
