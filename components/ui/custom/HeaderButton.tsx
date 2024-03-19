"use client";
import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  text: String;
};

const HeaderButton = ({ text }: Props) => {
  return <Button variant="ghost">{text}</Button>;
};

export default HeaderButton;
