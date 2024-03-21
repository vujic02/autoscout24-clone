"use client";
import React, { useState } from "react";
import { HeaderDesktop, HeaderMobile, HeaderMobileOverlay } from "./ui/custom";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLanguagesMobileOpen, setIsLanguagesMobileOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div className="fixed top-0 w-full bg-accent h-[72px] flex justify-center">
      <HeaderDesktop language={language} setLanguage={setLanguage} />
      <HeaderMobile isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <HeaderMobileOverlay
        isLanguagesMobileOpen={isLanguagesMobileOpen}
        setIsLanguagesMobileOpen={setIsLanguagesMobileOpen}
        isMobileOpen={isMobileOpen}
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default Header;
