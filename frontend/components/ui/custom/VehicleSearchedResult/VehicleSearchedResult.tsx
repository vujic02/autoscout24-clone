"use client";
import React from "react";
import { VehicleSearchedResultDesktop, VehicleSearchedResultMobile } from "./VehicleSearchedResultComponents";
import { Listing } from "@/lib/api";

type Props = {
  listing: Listing;
};

const VehicleSearchedResult = ({ listing }: Props) => {
  return (
    <>
      <div className="hidden md:block">
        <VehicleSearchedResultDesktop listing={listing} />
      </div>
      <div className="block md:hidden">
        <VehicleSearchedResultMobile listing={listing} />
      </div>
    </>
  );
};

export default VehicleSearchedResult;
