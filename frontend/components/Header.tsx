"use client";
import React, { useState, useEffect } from "react";
import { HeaderDesktop, HeaderMobile, HeaderMobileOverlay } from "./ui/custom";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLanguagesMobileOpen, setIsLanguagesMobileOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to check and update auth status
  const checkAuthStatus = async () => {
    const token = localStorage.getItem("authToken");
    const authUser = localStorage.getItem("authUser");

    if (token && authUser) {
      try {
        const user = JSON.parse(authUser);
        setIsLoggedIn(true);
        setUserEmail(user.username || user.email || "");

        // Verify admin status with backend (don't trust localStorage)
        const res = await fetch("http://127.0.0.1:8000/api/auth/current-user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setIsAdmin(userData.is_staff === true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to verify user data:", err);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check auth status on initial mount
    checkAuthStatus();

    // Listen for storage changes (for login/logout from other tabs or the same tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Listen for custom auth events (for same-tab updates)
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 w-full bg-accent h-[72px] flex justify-center">
      <HeaderDesktop language={language} setLanguage={setLanguage} isLoggedIn={isLoggedIn} userEmail={userEmail} isAdmin={isAdmin} />
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
