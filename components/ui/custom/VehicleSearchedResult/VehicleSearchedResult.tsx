"use client";
import Link from "next/link";
import React from "react";
import { Star, Mail, Facebook, Link as LinkIcon, Share2 } from "lucide-react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";

type Props = {
  favorite: boolean;
  setFavorite: React.Dispatch<React.SetStateAction<boolean>>;
};

const VehicleSearchedResult = ({ favorite, setFavorite }: Props) => {
  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center">
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
              <DropdownMenu.DropdownMenuContent className="w-56">
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
              </DropdownMenu.DropdownMenuContent>
            </DropdownMenu.DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearchedResult;
