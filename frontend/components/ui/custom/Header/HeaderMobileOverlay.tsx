import React, { useMemo } from "react";
import Image from "next/image";
import { Button } from "../../button";
import { HeaderButton } from "./HeaderComponents";
import { ArrowRight } from "lucide-react";

type Props = {
  isLanguagesMobileOpen: boolean;
  isMobileOpen: boolean;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setIsLanguagesMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderMobileOverlay = ({ isLanguagesMobileOpen, isMobileOpen, language, setLanguage, setIsLanguagesMobileOpen }: Props) => {
  return (
    <div
      id="mobile-header-overlay"
      className={`absolute z-50 top-[72px] w-full h-screen p-4 bg-[#f4f4f4] ${isMobileOpen ? "flex flex-col md:hidden" : "hidden"}`}
    >
      {isLanguagesMobileOpen ? (
        <>
          <div
            className={`flex justify-between cursor-pointer text-black ${
              language === "English" ? "!bg-gray-200" : ""
            } bg-white border border-transparent hover:border-gray-300 transition-all p-4`}
            onClick={() => {
              setLanguage("English");
              setIsLanguagesMobileOpen(false);
            }}
          >
            English
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/GB/flat/24.png" />
          </div>
          <div
            onClick={() => {
              setLanguage("German");
              setIsLanguagesMobileOpen(false);
            }}
            className={`flex justify-between cursor-pointer text-black ${
              language === "German" ? "!bg-gray-200" : ""
            } bg-white border border-transparent hover:border-gray-300 transition-all mt-1 p-4`}
          >
            German
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/DE/flat/24.png" />
          </div>
          <div
            onClick={() => {
              setLanguage("Italian");
              setIsLanguagesMobileOpen(false);
            }}
            className={`flex justify-between cursor-pointer text-black ${
              language === "Italian" ? "!bg-gray-200" : ""
            } bg-white border border-transparent hover:border-gray-300 transition-all mt-1 p-4`}
          >
            Italian
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/IT/flat/24.png" />
          </div>
          <div
            onClick={() => {
              setLanguage("French");
              setIsLanguagesMobileOpen(false);
            }}
            className={`flex justify-between cursor-pointer text-black ${
              language === "French" ? "!bg-gray-200" : ""
            } bg-white border border-transparent hover:border-gray-300 transition-all mt-1 p-4`}
          >
            French
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/FR/flat/24.png" />
          </div>
          <Button onClick={() => setIsLanguagesMobileOpen(false)} variant={"default"} className="absolute top-96 right-4 z-50">
            Back
          </Button>
        </>
      ) : (
        <>
          <HeaderButton
            customCSS="bg-white flex justify-between items-center rounded-none font-light text-black py-6"
            text="Used and New Cars"
            icon={<ArrowRight />}
          />
          <HeaderButton
            customCSS="bg-white flex justify-between items-center rounded-none font-light mt-[1px] text-black py-6"
            text="Motorbikes"
            icon={<ArrowRight />}
          />
          <div className="w-full" onClick={() => setIsLanguagesMobileOpen(true)}>
            <HeaderButton
              customCSS="mt-8 w-full bg-white flex justify-between items-center rounded-none font-light text-black py-6"
              text={language}
              icon={<ArrowRight />}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderMobileOverlay;
