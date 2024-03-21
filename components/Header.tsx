"use client";
import React, { useState } from "react";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLanguagesMobileOpen, setIsLanguagesMobileOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div className="bg-accent h-[72px] flex justify-center">
      <HeaderDesktop language={language} setLanguage={setLanguage} />
      <HeaderMobile />
      <HeaderMobileOverlay />
    </div>
  );
};

export default Header;
