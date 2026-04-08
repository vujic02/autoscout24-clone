"use client";

import React, { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

import { ChevronDown, LayoutDashboard, List, User, PlusCircle, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type PropsHeaderButtonDropdown = {
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  customCSS?: string;
  language: string;
  setLanguage: (lang: string) => void;
};

const HeaderButtonDropdown = ({ variant, customCSS, language, setLanguage }: PropsHeaderButtonDropdown) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={`text-base ${customCSS}`}>
          {language} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value)}>
          <DropdownMenuRadioItem className="data-[state=checked]:bg-gray-400 flex justify-between cursor-pointer data-[state=checked]:cursor-default" value="English">
            English
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/GB/flat/24.png" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="data-[state=checked]:bg-gray-400 flex justify-between cursor-pointer data-[state=checked]:cursor-default" value="German">
            Deutsch
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/DE/flat/24.png" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type PropsHeaderButton = {
  text?: String;
  icon?: ReactNode;
  customCSS?: String;
  href?: string;
};

const HeaderButton = ({ text, icon, customCSS, href }: PropsHeaderButton) => {
  const btn = (
    <Button variant="ghost" className={`group text-base ${customCSS}`}>
      {text && text}
      {icon && icon}
    </Button>
  );
  if (href) {
    return <a href={href}>{btn}</a>;
  }
  return btn;
};

type PropsMenuIcon = {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuIcon = ({ isMobileOpen, setIsMobileOpen }: PropsMenuIcon) => {
  return (
    <div
      id="hamburger-icon"
      className="w-[20px] h-[14px] relative rotate-0 transition-transform cursor-pointer duration-500"
      onClick={() => setIsMobileOpen((prev) => !prev)}
    >
      <span
        className={`block absolute h-[2px] w-full bg-white opacity-100 left-0 rotate-0 transition-all duration-500 top-0 ${
          isMobileOpen ? "!rotate-45 !top-[6px] duration-500" : ""
        }`}
      ></span>
      <span
        className={`block absolute h-[2px] w-full bg-white opacity-100 left-0 rotate-0 transition-all duration-500 top-[6px] ${
          isMobileOpen ? "!w-0 !opacity-0 duration-500" : ""
        }`}
      ></span>
      <span
        className={`block absolute h-[2px] w-full bg-white opacity-100 left-0 rotate-0 transition-all duration-500 top-[12px] ${
          isMobileOpen ? "!-rotate-45 !top-[6px] duration-500" : ""
        }`}
      ></span>
    </div>
  );
};

type PropsUserAuthDropdown = {
  isLoggedIn?: boolean;
  userEmail?: string;
  isAdmin?: boolean;
};

const UserAuthDropdown = ({ isLoggedIn = false, userEmail, isAdmin = false }: PropsUserAuthDropdown) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("isAdmin");

    // Reload the page to update the header and redirect to home
    window.location.href = "/";
  };

  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <Button variant="ghost" className="text-base">
          {t("nav.logIn")}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-base max-w-[200px] truncate">
          {userEmail} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer flex items-center gap-2">
                <LayoutDashboard size={16} /> {t("nav.adminDashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/my-listings" className="cursor-pointer flex items-center gap-2">
            <List size={16} /> {t("nav.myListings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex items-center gap-2">
            <User size={16} /> {t("nav.myProfile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/add-listing" className="cursor-pointer flex items-center gap-2">
            <PlusCircle size={16} /> {t("nav.addListing")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center gap-2">
          <LogOut size={16} /> {t("nav.logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { HeaderButtonDropdown, HeaderButton, MenuIcon, UserAuthDropdown };
