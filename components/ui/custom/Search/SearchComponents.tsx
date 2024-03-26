import React from "react";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { customSelectData } from "@/types/Home";

type VehicleSelectProps = {
  data: customSelectData;
};

const CarsComponent = ({ data }: VehicleSelectProps) => {
  return (
    <div className="">
      <CustomSelect data={data} />
    </div>
  );
};

const MotorcyclesComponent = ({ data }: VehicleSelectProps) => {
  return (
    <div className="">
      <CustomSelect data={data} />
    </div>
  );
};

export { MotorcyclesComponent, CarsComponent };
