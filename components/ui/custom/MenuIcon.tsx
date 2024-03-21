"use client";
import React from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuIcon = ({ isOpen, setIsOpen }: Props) => {
  return (
    <div
      id="hamburger-icon"
      className="w-[20px] h-[14px] relative rotate-0 transition-transform cursor-pointer duration-500"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <span
        className={`block absolute h-[2px] w-full bg-white opacity-100 left-0 rotate-0 transition-all duration-500 top-0 ${
          isOpen ? "!rotate-45 !top-[6px] duration-500" : ""
        }`}
      ></span>
      <span
        className={`block absolute h-[2px] w-full bg-white opacity-100 left-0 rotate-0 transition-all duration-500 top-[6px] ${
          isOpen ? "!w-0 !opacity-0 duration-500" : ""
        }`}
      ></span>
      <span
        className={`block absolute h-[2px] w-full bg-white opacity-100 left-0 rotate-0 transition-all duration-500 top-[12px] ${
          isOpen ? "!-rotate-45 !top-[6px] duration-500" : ""
        }`}
      ></span>
    </div>
  );
};

export default MenuIcon;
