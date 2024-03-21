import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { MenuIcon } from "./HeaderComponents";

type Props = {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderMobile = ({ isMobileOpen, setIsMobileOpen }: Props) => {
  return (
    <div id="mobile-header" className="flex md:hidden w-full justify-between items-center px-4">
      <MenuIcon isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <Image className="ml-4" alt="" width={126} height={30} src="./icons/as24.svg" />
      <Link href="/favorites">
        <Star className="fill-accent-foreground text-accent-foreground" />
      </Link>
    </div>
  );
};

export default HeaderMobile;
