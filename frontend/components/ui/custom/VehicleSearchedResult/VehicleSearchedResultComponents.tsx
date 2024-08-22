"use client";
import React from "react";
import { Star, Mail, Facebook, Link as LinkIcon, Share2 } from "lucide-react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

type Props = {
  favorite: boolean;
  setFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  image: boolean;
};

const VehicleSearchedResultDesktop = ({ favorite, setFavorite, image }: Props) => {
  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Link className="text-[#333] font-semibold text-xl" href="#">
            BMW 318d
          </Link>
          <p className="text-[#333] font-normal text-base">318d Touring 2.0 143cv</p>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <div className="rounded-full bg-[#f3f4f5] hover:bg-[#e8eaec] transition-all p-2 cursor-pointer">
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
        <div className="max-w-[266px] max-h-[199px] relative">
          <Image width={266} height={199} alt="#" src="/testimage.webp" />
          <div className="absolute bottom-2 left-2 h-9 w-[50px] flex justify-center items-center bg-[#00000080] text-white border border-white rounded-sm font-light text-xs">
            1 / 10
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h2 className="text-[28px] font-semibold">€ 7,200.-</h2>
          <div className="flex items-center flex-wrap gap-x-8 gap-y-2 mt-4">
            <div className="flex gap-x-2">
              <Image className="object-contain" width={24} height={24} alt="#" src="/icons/road.png"></Image>
              <p className="text-[#333] font-normal text-base">244,400 km</p>
            </div>
            <div className="flex gap-2">
              <Image className="object-contain" width={24} height={24} alt="#" src="/icons/gearbox.png"></Image>
              <p className="text-[#333] font-normal text-base">Automatic</p>
            </div>
            <div className="flex gap-x-2">
              <Image className="object-contain" width={24} height={24} alt="#" src="/icons/calendar.png"></Image>
              <p className="text-[#333] font-normal text-base">06/2011</p>
            </div>
            <div className="flex gap-x-2">
              <Image className="object-contain" width={24} height={24} alt="#" src="/icons/gas.png"></Image>
              <p className="text-[#333] font-normal text-base">Diesel</p>
            </div>
            <div className="flex gap-x-2">
              <Image className="object-contain" width={24} height={24} alt="#" src="/icons/speedometer.png"></Image>
              <p className="text-[#333] font-normal text-base">220 kW (299 hp)</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 border-t border-t-[#eaeaea]">
        <div className="mt-4 px-4">
          {image ? <img src="#" alt="#"></img> : null}
          <div className="flex flex-col">
            <p className="text-[#333] text-sm font-normal">PG Cars</p>
            <p className="text-[#333] text-sm font-normal">Lukas Sternberger • AT-7423 Pinkafeld</p>
          </div>
        </div>
        <div className="mt-4 px-4">
          <a className="text-[#1166a8] text-base font-normal hover:text-[#1167a8cc] transition-colors duration-300" href="#">
            + Show more vehicles
          </a>
        </div>
      </div>
    </div>
  );
};

const VehicleSearchedResultMobile = ({ favorite, setFavorite, image }: Props) => {
  return (
    <div style={{ boxShadow: "0 2px 6px #dcdcdc" }} className="bg-white pb-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full">
          <img className="w-full h-full" alt="#" src="/testimage.webp" />
          <div className="absolute bottom-2 left-2 h-9 w-[50px] flex justify-center items-center bg-[#00000080] text-white border border-white rounded-sm font-light text-xs">
            1 / 10
          </div>
          <div className="flex absolute top-2 right-2 items-center gap-2 pr-2">
            <div className="rounded-full bg-[#f3f4f5] hover:bg-[#e8eaec] transition-all p-2 cursor-pointer">
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
          <Link className="text-[#333] font-semibold text-xl" href="#">
            BMW 318d
          </Link>
          <p className="text-[#333] font-normal text-base">318d Touring 2.0 143cv</p>
        </div>
        <div className="flex flex-col mt-4">
          <h2 className="text-2xl font-semibold">€ 7,200.-</h2>
          <div className="flex items-center flex-wrap gap-x-8 gap-y-2 mt-4">
            <div className="flex gap-x-2">
              <Image className="object-contain" width={20} height={20} alt="#" src="/icons/road.png"></Image>
              <p className="text-[#333] font-normal text-sm">244,400 km</p>
            </div>
            <div className="flex gap-2">
              <Image className="object-contain" width={20} height={20} alt="#" src="/icons/gearbox.png"></Image>
              <p className="text-[#333] font-normal text-sm">Automatic</p>
            </div>
            <div className="flex gap-x-2">
              <Image className="object-contain" width={20} height={20} alt="#" src="/icons/calendar.png"></Image>
              <p className="text-[#333] font-normal text-sm">06/2011</p>
            </div>
            <div className="flex gap-x-2">
              <Image className="object-contain" width={20} height={20} alt="#" src="/icons/gas.png"></Image>
              <p className="text-[#333] font-normal text-sm">Diesel</p>
            </div>
            <div className="flex gap-x-2">
              <Image className="object-contain" width={20} height={20} alt="#" src="/icons/speedometer.png"></Image>
              <p className="text-[#333] font-normal text-sm">220 kW (299 hp)</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 border-t border-t-[#eaeaea]">
        <div className="mt-4 px-4">
          {image ? <img src="#" alt="#"></img> : null}
          <div className="flex flex-col">
            <p className="text-[#333] text-sm font-normal">PG Cars</p>
            <p className="text-[#333] text-sm font-normal">Lukas Sternberger • AT-7423 Pinkafeld</p>
          </div>
        </div>
        <div className="mt-4 px-4">
          <a className="text-[#1166a8] text-base font-normal hover:text-[#1167a8cc] transition-colors duration-300" href="#">
            + Show more vehicles
          </a>
        </div>
      </div>
    </div>
  );
};

export { VehicleSearchedResultDesktop, VehicleSearchedResultMobile };
