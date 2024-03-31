"use client";
import React, { useState } from "react";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { customSelectData } from "@/types/Home";

type VehicleSelectProps = {
  make: customSelectData;
  model: any;
};

const CarsComponent = ({ make, model }: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const modelData = model[selectedMake];

  return (
    <div className="">
      <CustomSelect data={make} setSelectedOption={setSelectedMake} />
      <CustomSelect disabled={selectedMake === "" ? true : false} data={modelData && [modelData]} setSelectedOption={setSelectedModel} />
    </div>
  );
};

const MotorcyclesComponent = ({ make, model }: VehicleSelectProps) => {
  return (
    <div className="">
      {/* <CustomSelect data={make} />
      <CustomSelect data={model} /> */}
    </div>
  );
};

export { MotorcyclesComponent, CarsComponent };
