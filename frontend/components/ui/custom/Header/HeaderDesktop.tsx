import React from "react";
import { HeaderButton, HeaderButtonDropdown, UserAuthDropdown } from "./HeaderComponents";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type Props = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn?: boolean;
  userEmail?: string;
  isAdmin?: boolean;
};

const HeaderDesktop = ({ language, setLanguage, isLoggedIn, userEmail, isAdmin }: Props) => {
  return (
    <div id="desktop-header" className="max-w-[1100px] w-full hidden md:flex md:items-center md:justify-between">
      <div className="flex gap-5">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image alt="AutoScout24" width={126} height={30} src="./icons/as24.svg" />
        </Link>
        <HeaderButton text="Used and New Cars" />
        <HeaderButton text="Motorbikes" />
      </div>

      <div className="flex gap-3">
        <Link href="/favorites">
          <HeaderButton icon={<Star className="fill-accent-foreground group-hover:fill-accent" />} />
        </Link>
        <UserAuthDropdown isLoggedIn={isLoggedIn} userEmail={userEmail} isAdmin={isAdmin} />
        <HeaderButtonDropdown language={language} setLanguage={setLanguage} variant="ghost" />
      </div>
    </div>
  );
};

export default HeaderDesktop;
