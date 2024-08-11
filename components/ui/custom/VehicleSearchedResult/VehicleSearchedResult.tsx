"use client";
import React from "react";
import { VehicleSearchedResultDesktop, VehicleSearchedResultMobile } from "./VehicleSearchedResultComponents";

type Props = {
  favorite: boolean;
  setFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  image: boolean;
};

const VehicleSearchedResult = ({ favorite, setFavorite, image }: Props) => {
  return (
    <>
      <div className="hidden md:block">
        <VehicleSearchedResultDesktop favorite={favorite} setFavorite={setFavorite} image={image} />
      </div>
      <div className="block md:hidden">
        <VehicleSearchedResultMobile favorite={favorite} setFavorite={setFavorite} image={image} />
      </div>
    </>
  );
};

export default VehicleSearchedResult;
