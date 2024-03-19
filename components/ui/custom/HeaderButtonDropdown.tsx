"use client";

import React, { useState } from "react";
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

const HeaderButtonDropdown = () => {
  const [language, setLanguage] = useState("English");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-base">
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

export default HeaderButtonDropdown;
