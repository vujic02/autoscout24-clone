import React, { useMemo } from "react";
import Image from "next/image";
import { Button } from "../../button";
import { HeaderButton } from "./HeaderComponents";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

type Props = {
  isLanguagesMobileOpen: boolean;
  isMobileOpen: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  setIsLanguagesMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderMobileOverlay = ({ isLanguagesMobileOpen, isMobileOpen, language, setLanguage, setIsLanguagesMobileOpen }: Props) => {
  const { t } = useTranslation();
  return (
    <div id="mobile-header-overlay" className={`absolute z-50 top-[72px] w-full h-screen p-4 bg-[#f4f4f4] ${isMobileOpen ? "flex flex-col md:hidden" : "hidden"}`}>
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
            Deutsch
            <Image className="ml-2" width={24} height={24} alt="#" src="https://flagsapi.com/DE/flat/24.png" />
          </div>
          <Button onClick={() => setIsLanguagesMobileOpen(false)} variant={"default"} className="absolute top-96 right-4 z-50">
            {t("common.back")}
          </Button>
        </>
      ) : (
        <>
          <HeaderButton
            customCSS="bg-white flex justify-between items-center rounded-none font-light text-black py-6"
            text={t("nav.usedCars")}
            icon={<ArrowRight />}
            href="/search"
          />
          <HeaderButton
            customCSS="bg-white flex justify-between items-center rounded-none font-light mt-[1px] text-black py-6"
            text={t("nav.newCars")}
            icon={<ArrowRight />}
            href="/search?registration=2026"
          />
          <HeaderButton
            customCSS="bg-white flex justify-between items-center rounded-none font-light mt-[1px] text-black py-6"
            text={t("nav.motorbikes")}
            icon={<ArrowRight />}
            href="/search?body_type=motorcycle"
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
