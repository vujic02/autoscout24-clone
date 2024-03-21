"use client";

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import { ChevronDown } from "lucide-react";

type PropsHeaderButtonDropdown = {
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  customCSS?: string;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const HeaderButtonDropdown = ({ variant, customCSS, language, setLanguage }: PropsHeaderButtonDropdown) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={`text-base ${customCSS}`}>
          {language} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value)}>
          <DropdownMenuRadioItem
            className="data-[state=checked]:bg-gray-400 flex justify-between cursor-pointer data-[state=checked]:cursor-default"
            value="English"
          >
            English
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/GB/flat/24.png" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="data-[state=checked]:bg-gray-400 flex justify-between cursor-pointer data-[state=checked]:cursor-default"
            value="German"
          >
            German
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/DE/flat/24.png" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="data-[state=checked]:bg-gray-400 flex justify-between cursor-pointer data-[state=checked]:cursor-default"
            value="Italian"
          >
            Italian
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/IT/flat/24.png" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className="data-[state=checked]:bg-gray-400 flex justify-between cursor-pointer data-[state=checked]:cursor-default"
            value="French"
          >
            French
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/FR/flat/24.png" />
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
};

const HeaderButton = ({ text, icon, customCSS }: PropsHeaderButton) => {
  return (
    <Button variant="ghost" className={`group text-base ${customCSS}`}>
      {text && text}
      {icon && icon}
    </Button>
  );
};

export default HeaderButton;

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

export { HeaderButtonDropdown, HeaderButton, MenuIcon };
