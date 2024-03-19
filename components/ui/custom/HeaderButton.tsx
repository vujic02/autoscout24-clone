"use client";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  text?: String;
  icon?: ReactNode;
};

const HeaderButton = ({ text, icon }: Props) => {
  return (
    <Button variant="ghost" className="group text-base">
      {text && text}
      {icon && icon}
    </Button>
  );
};

export default HeaderButton;
