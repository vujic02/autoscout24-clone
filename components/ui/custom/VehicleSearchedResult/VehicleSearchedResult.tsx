"use client";
import React from "react";
import { VehicleSearchedResultDesktop } from "./VehicleSearchedResultComponents";

type Props = {
  favorite: boolean;
  setFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  image: boolean;
};

const VehicleSearchedResult = ({ favorite, setFavorite, image }: Props) => {
  return <VehicleSearchedResultDesktop favorite={favorite} image={image} setFavorite={setFavorite} />;
};

export default VehicleSearchedResult;
