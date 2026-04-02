"use client";
import React, { useState, useEffect } from "react";
import { Star, Mail, Facebook, Link as LinkIcon, Share2 } from "lucide-react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/api";
import { addFavorite, removeFavorite, fetchFavoriteIds } from "@/lib/api";

type Props = {
  listing: Listing;
};

const useFavorite = (listingId: number) => {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    fetchFavoriteIds().then((ids) => {
      if (ids.includes(listingId)) setFavorite(true);
    });
  }, [listingId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const newState = !favorite;
    setFavorite(newState);
    if (newState) {
      await addFavorite(listingId);
    } else {
      await removeFavorite(listingId);
    }
  };

  return { favorite, toggleFavorite };
};

const VehicleSearchedResultDesktop = ({ listing }: Props) => {
  const { favorite, toggleFavorite } = useFavorite(listing.id);
  const imageCount = (listing.images?.length || 0) + (listing.main_image && (!listing.images || listing.images.length === 0) ? 1 : 0);

  return (
    <Link href={`/vehicle/${listing.id}`} className="block">
      <div className="bg-white p-4 hover:shadow-lg transition-shadow cursor-pointer rounded-lg border border-gray-200">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-[#333] font-semibold text-xl hover:text-blue-600">
              {listing.make} {listing.model}
            </span>
            <p className="text-[#333] font-normal text-base">{listing.title}</p>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <div onClick={toggleFavorite} className="rounded-full bg-[#f3f4f5] hover:bg-[#e8eaec] transition-all p-2 cursor-pointer">
              <Star width={20} height={20} className={`${favorite ? "fill-black" : "fill-trasparent"}`} />
            </div>
            <div className="rounded-full bg-[#f3f4f5] hover:bg-[#e8eaec] transition-all p-2 cursor-pointer">
              <DropdownMenu.DropdownMenu>
                <DropdownMenu.DropdownMenuTrigger asChild>
                  <Share2 width={20} height={20} className="fill-transparent" />
                </DropdownMenu.DropdownMenuTrigger>
                <DropdownMenu.DropdownMenuContent
                  style={{ boxShadow: "0 12px 24px 0 #0000000d, 0 8px 16px 0 #0000000d, 0 4px 8px 0 #0000000d, 0 0 2px 0 #0000001f" }}
                  className="w-56 mt-3 relative overflow-visible !border-0"
                >
                  <DropdownMenu.DropdownMenuLabel>Share offer</DropdownMenu.DropdownMenuLabel>
                  <DropdownMenu.DropdownMenuSeparator />
                  <DropdownMenu.DropdownMenuGroup>
                    <DropdownMenu.DropdownMenuItem className="hover:!bg-transparent hover:!text-[unset]">
                      <div className="rounded-full bg-[#676767] p-1.5">
                        <Mail width={18} height={18} className="text-white" />
                      </div>
                      <a className="ml-2 text-blue-600 text-" href="#">
                        E-Mail
                      </a>
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem className="hover:!bg-transparent hover:!text-[unset]">
                      <div className="rounded-full bg-blue-600 p-1.5">
                        <Facebook width={18} height={18} className="text-white" />
                      </div>
                      <a className="ml-2 text-blue-600 text-" href="#">
                        Facebook
                      </a>
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem className="hover:!bg-transparent hover:!text-[unset]">
                      <div className="rounded-full bg-[#676767] p-1.5">
                        <LinkIcon width={18} height={18} className="text-white" />
                      </div>
                      <a className="ml-2 text-blue-600 text-" href="#">
                        Copy link
                      </a>
                    </DropdownMenu.DropdownMenuItem>
                  </DropdownMenu.DropdownMenuGroup>
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 rotate-180 z-50">
                    <svg fill="white" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none">
                      <polygon points="0,0 30,0 15,10"></polygon>
                    </svg>
                  </div>
                </DropdownMenu.DropdownMenuContent>
              </DropdownMenu.DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-x-3 mt-6 px-4">
          <div
            className={`relative max-w-[266px] max-h-[199px] ${listing.main_image ? "w-full h-full" : "flex justify-center items-center w-full h-[199px] bg-slate-50"}`}
          >
            <img className={`${listing.main_image ? "w-full h-full" : "w-36 h-36"}`} alt="#" src={listing.main_image ? listing.main_image : "/bg404.png"} />
            <div className="absolute bottom-2 left-2 h-9 w-[50px] flex justify-center items-center bg-[#00000080] text-white border border-white rounded-sm font-light text-xs">
              1 / {imageCount || 1}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h2 className="text-[28px] font-semibold">€ {listing.price}.-</h2>
            <div className="flex items-center flex-wrap gap-x-8 gap-y-2 mt-4">
              <div className="flex gap-x-2">
                <Image className="object-contain" width={24} height={24} alt="#" src="/icons/road.png"></Image>
                <p className="text-[#333] font-normal text-base">{listing.mileage} km</p>
              </div>
              {listing.transmission && (
                <div className="flex gap-2">
                  <Image className="object-contain" width={24} height={24} alt="#" src="/icons/gearbox.png"></Image>
                  <p className="text-[#333] font-normal text-base capitalize">{listing.transmission}</p>
                </div>
              )}
              <div className="flex gap-x-2">
                <Image className="object-contain" width={24} height={24} alt="#" src="/icons/calendar.png"></Image>
                <p className="text-[#333] font-normal text-base">{listing.registration_year}</p>
              </div>
              <div className="flex gap-x-2">
                <Image className="object-contain" width={24} height={24} alt="#" src="/icons/gas.png"></Image>
                <p className="text-[#333] font-normal text-base capitalize">{listing.fuel_type}</p>
              </div>
              {listing.horsepower && (
                <div className="flex gap-x-2">
                  <Image className="object-contain" width={24} height={24} alt="#" src="/icons/speedometer.png"></Image>
                  <p className="text-[#333] font-normal text-base">{listing.horsepower} hp</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 border-t border-t-[#eaeaea]">
          <div className="mt-4 px-4 flex items-center gap-3">
            {listing.seller?.seller_type === "dealer" && listing.seller.company_image && (
              <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                <Image src={`http://127.0.0.1:8000${listing.seller.company_image}`} alt="Dealer" fill className="object-contain" />
              </div>
            )}
            <div className="flex flex-col">
              {listing.seller?.seller_type === "dealer" && listing.seller.company_name && (
                <p className="text-[#333] text-sm font-medium">{listing.seller.company_name}</p>
              )}
              <p className="text-[#333] text-sm font-normal">
                {listing.seller?.display_name || listing.seller?.username || "Private seller"}
                {listing.seller?.location ? ` \u2022 ${listing.seller.location}` : listing.city ? ` \u2022 ${listing.city}, ${listing.country}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-4 px-4">
            <Link
              href={`/search?seller=${listing.seller?.username || ""}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[#1166a8] text-base font-normal hover:text-[#1167a8cc] transition-colors duration-300"
            >
              + Show more vehicles
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

const VehicleSearchedResultMobile = ({ listing }: Props) => {
  const { favorite, toggleFavorite } = useFavorite(listing.id);
  const imageCount = (listing.images?.length || 0) + (listing.main_image && (!listing.images || listing.images.length === 0) ? 1 : 0);

  return (
    <Link href={`/vehicle/${listing.id}`} className="block">
      <div
        style={{ boxShadow: "0 2px 6px #dcdcdc" }}
        className="bg-white pb-4 hover:shadow-lg transition-shadow cursor-pointer rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="flex justify-between items-center">
          <div className={`relative ${listing.main_image ? "w-full h-full" : "flex justify-center items-center w-full min-h-72 h-full bg-slate-50"}`}>
            <img className={`${listing.main_image ? "w-full h-full" : "w-16 h-16"}`} alt="#" src={listing.main_image ? listing.main_image : "/bg404.png"} />
            <div className="absolute bottom-2 left-2 h-9 w-[50px] flex justify-center items-center bg-[#00000080] text-white border border-white rounded-sm font-light text-xs">
              1 / {imageCount || 1}
            </div>
            <div className="flex absolute top-2 right-2 items-center gap-2 pr-2">
              <div onClick={toggleFavorite} className="rounded-full bg-[#f3f4f5] hover:bg-[#e8eaec] transition-all p-2 cursor-pointer">
                <Star width={20} height={20} className={`${favorite ? "fill-black" : "fill-trasparent"}`} />
              </div>
              <div className="rounded-full bg-[#f3f4f5] hover:bg-[#e8eaec] transition-all p-2 cursor-pointer">
                <DropdownMenu.DropdownMenu>
                  <DropdownMenu.DropdownMenuTrigger asChild>
                    <Share2 width={20} height={20} className="fill-transparent" />
                  </DropdownMenu.DropdownMenuTrigger>
                  <DropdownMenu.DropdownMenuContent
                    style={{ boxShadow: "0 12px 24px 0 #0000000d, 0 8px 16px 0 #0000000d, 0 4px 8px 0 #0000000d, 0 0 2px 0 #0000001f" }}
                    className="w-56 mt-3 relative overflow-visible !border-0"
                  >
                    <DropdownMenu.DropdownMenuLabel>Share offer</DropdownMenu.DropdownMenuLabel>
                    <DropdownMenu.DropdownMenuSeparator />
                    <DropdownMenu.DropdownMenuGroup>
                      <DropdownMenu.DropdownMenuItem className="hover:!bg-transparent hover:!text-[unset]">
                        <div className="rounded-full bg-[#676767] p-1.5">
                          <Mail width={18} height={18} className="text-white" />
                        </div>
                        <a className="ml-2 text-blue-600 text-" href="#">
                          E-Mail
                        </a>
                      </DropdownMenu.DropdownMenuItem>
                      <DropdownMenu.DropdownMenuItem className="hover:!bg-transparent hover:!text-[unset]">
                        <div className="rounded-full bg-blue-600 p-1.5">
                          <Facebook width={18} height={18} className="text-white" />
                        </div>
                        <a className="ml-2 text-blue-600 text-" href="#">
                          Facebook
                        </a>
                      </DropdownMenu.DropdownMenuItem>
                      <DropdownMenu.DropdownMenuItem className="hover:!bg-transparent hover:!text-[unset]">
                        <div className="rounded-full bg-[#676767] p-1.5">
                          <LinkIcon width={18} height={18} className="text-white" />
                        </div>
                        <a className="ml-2 text-blue-600 text-" href="#">
                          Copy link
                        </a>
                      </DropdownMenu.DropdownMenuItem>
                    </DropdownMenu.DropdownMenuGroup>
                    <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 rotate-180 z-50">
                      <svg fill="white" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none">
                        <polygon points="0,0 30,0 15,10"></polygon>
                      </svg>
                    </div>
                  </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start gap-x-3 mt-6 px-4">
          <div className="flex items-center gap-2">
            <Link className="text-[#333] font-semibold text-xl hover:text-blue-600" href={`/vehicle/${listing.id}`}>
              {listing.make} {listing.model}
            </Link>
            <p className="text-[#333] font-normal text-base">{listing.title}</p>
          </div>
          <div className="flex flex-col mt-4">
            <h2 className="text-2xl font-semibold">€ {listing.price}.-</h2>
            <div className="flex items-center flex-wrap gap-x-8 gap-y-2 mt-4">
              <div className="flex gap-x-2">
                <Image className="object-contain" width={20} height={20} alt="#" src="/icons/road.png"></Image>
                <p className="text-[#333] font-normal text-sm">{listing.mileage} km</p>
              </div>
              {listing.transmission && (
                <div className="flex gap-2">
                  <Image className="object-contain" width={20} height={20} alt="#" src="/icons/gearbox.png"></Image>
                  <p className="text-[#333] font-normal text-sm capitalize">{listing.transmission}</p>
                </div>
              )}
              <div className="flex gap-x-2">
                <Image className="object-contain" width={20} height={20} alt="#" src="/icons/calendar.png"></Image>
                <p className="text-[#333] font-normal text-sm">{listing.registration_year}</p>
              </div>
              <div className="flex gap-x-2">
                <Image className="object-contain" width={20} height={20} alt="#" src="/icons/gas.png"></Image>
                <p className="text-[#333] font-normal text-sm capitalize">{listing.fuel_type}</p>
              </div>
              {listing.horsepower && (
                <div className="flex gap-x-2">
                  <Image className="object-contain" width={20} height={20} alt="#" src="/icons/speedometer.png"></Image>
                  <p className="text-[#333] font-normal text-sm">{listing.horsepower} hp</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 border-t border-t-[#eaeaea]">
          <div className="mt-4 px-4 flex items-center gap-3">
            {listing.seller?.seller_type === "dealer" && listing.seller.company_image && (
              <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                <Image src={`http://127.0.0.1:8000${listing.seller.company_image}`} alt="Dealer" fill className="object-contain" />
              </div>
            )}
            <div className="flex flex-col">
              {listing.seller?.seller_type === "dealer" && listing.seller.company_name && (
                <p className="text-[#333] text-sm font-medium">{listing.seller.company_name}</p>
              )}
              <p className="text-[#333] text-sm font-normal">
                {listing.seller?.display_name || listing.seller?.username || "Private seller"}
                {listing.seller?.location ? ` \u2022 ${listing.seller.location}` : listing.city ? ` \u2022 ${listing.city}, ${listing.country}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-4 px-4">
            <Link
              href={`/search?seller=${listing.seller?.username || ""}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[#1166a8] text-base font-normal hover:text-[#1167a8cc] transition-colors duration-300"
            >
              + Show more vehicles
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { VehicleSearchedResultDesktop, VehicleSearchedResultMobile };
