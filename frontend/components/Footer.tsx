"use client";
import React from "react";
import { FooterTop, FooterBottom, FooterMid } from "./ui/custom";

const Footer = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-[1100px] w-full">
        <FooterTop />
        <FooterMid />
        <FooterBottom />
      </div>
    </div>
  );
};

export default Footer;
