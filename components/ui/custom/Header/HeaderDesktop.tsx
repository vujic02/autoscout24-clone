import React from "react";
import { HeaderButton, HeaderButtonDropdown } from "./HeaderComponents";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Props = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const HeaderDesktop = ({ language, setLanguage }: Props) => {
  return (
    <div id="desktop-header" className="max-w-[1100px] w-full hidden md:flex md:items-center md:justify-between">
      <div className="flex gap-5">
        <Image className="ml-4" alt="" width={126} height={30} src="./icons/as24.svg" />
        <HeaderButton text="Used and New Cars" />
        <HeaderButton text="Motorbikes" />
      </div>

      <div className="flex gap-3">
        <Link href="/favorites">
          <HeaderButton icon={<Star className="fill-accent-foreground group-hover:fill-accent" />} />
        </Link>
        <HeaderButtonDropdown language={language} setLanguage={setLanguage} variant="ghost" />
      </div>
    </div>
  );
};

export default HeaderDesktop;
