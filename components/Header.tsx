"use client";
import React from "react";
import { HeaderButton, HeaderButtonDropdown } from "@/components/ui/custom";
import Image from "next/image";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="bg-accent h-[72px] flex justify-center">
      <div className="max-w-[1100px] w-full flex items-center justify-between">
        <div className="flex gap-5">
          <Image className="ml-4" alt="" width={126} height={30} src="./as24.svg" />
          <HeaderButton text="Used and New Cars" />
          <HeaderButton text="Motorbikes" />
        </div>

        <div>
          <HeaderButton text="Star" />
          <HeaderButtonDropdown />
        </div>
      </div>
    </div>
  );
};

export default Header;
