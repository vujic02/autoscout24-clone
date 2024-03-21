"use client";
import React, { useState } from "react";
import { HeaderButton, HeaderButtonDropdown, MenuIcon } from "@/components/ui/custom";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-accent h-[72px] flex justify-center">
      <div className="max-w-[1100px] w-full hidden md:flex items-center justify-between">
        <div className="flex gap-5">
          <Image className="ml-4" alt="" width={126} height={30} src="./icons/as24.svg" />
          <HeaderButton text="Used and New Cars" />
          <HeaderButton text="Motorbikes" />
        </div>

        <div className="flex gap-3">
          <Link href="/favorites">
            <HeaderButton icon={<Star className="fill-accent-foreground group-hover:fill-accent" />} />
          </Link>
          <HeaderButtonDropdown variant="ghost" />
        </div>
      </div>
      <div className="flex w-full justify-between items-center px-4">
        <MenuIcon isOpen={isOpen} setIsOpen={setIsOpen} />
        <Image className="ml-4" alt="" width={126} height={30} src="./icons/as24.svg" />
        <Link href="/favorites">
          <Star className="fill-accent-foreground text-accent-foreground" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
