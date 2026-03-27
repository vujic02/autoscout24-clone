"use client";

import Image from "next/image";
import React from "react";

interface LastSearchCardProps {
  title: string;
  subtitle: string;
  thumbnails: string[];
  onMoreResultsClick?: () => void;
}

const LastSearchCard: React.FC<LastSearchCardProps> = ({ title, subtitle, thumbnails, onMoreResultsClick }) => {
  return (
    <section className="flex flex-col bg-white rounded-lg border border-[#e2e2e2] shadow-sm w-full">
      <div className="flex items-center gap-4 p-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-md bg-[#f5f5f5]">
          <span className="text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" aria-hidden="true">
              <path
                fill="#333"
                d="M23 0a16 16 0 1 1-10.57 28l-9.75 9.72a1 1 0 1 1-1.41-1.41L11 26.57A16 16 0 0 1 23 0m0 2C15.268 2 9 8.268 9 16s6.268 14 14 14a14 14 0 0 0 14-14c0-7.732-6.268-14-14-14m1.44 6a2 2 0 0 1 1.71 1l2.42 4H30a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2h-1.19a3 3 0 0 1-5.63 0h-4.37a3 3 0 0 1-5.63 0H14a2 2 0 0 1-2-2v-5.73a2 2 0 0 1 .29-1L14.86 9a2 2 0 0 1 1.71-1zM18 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3.56-10h-7.87l-1.8 3H17a1 1 0 0 1 0 2h-3v5h1.19a3 3 0 0 1 5.63 0h4.37a3 3 0 0 1 5.63 0H32v-3a2 2 0 0 0-2-2h-2a1 1 0 0 1-.85-.49zM23 12a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1"
              ></path>
            </svg>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-[#666]">Popular search</span>
          <span className="text-base font-semibold text-[#222]">{title}</span>
          <span className="text-xs text-[#666]">{subtitle}</span>
        </div>
      </div>

      <div className="border-t border-[#e2e2e2] flex items-center h-full px-4 py-1">
        <div className="flex -space-x-1">
          {thumbnails.slice(0, 4).map((src, idx) => (
            <div key={idx} className="w-12 h-12 rounded-sm overflow-hidden border-2 border-white bg-[#ddd]">
              <Image src={src} alt={`Last search ${idx + 1}`} width={48} height={48} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <button type="button" onClick={onMoreResultsClick} className="text-xs md:text-sm text-[#1166a8] font-medium hover:text-[#0f5790] ml-4">
          More results
        </button>
      </div>
    </section>
  );
};

export default LastSearchCard;
