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
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder="Make" data={make} setSelectedOption={setSelectedMake} />
        <CustomSelect
          placeholder="Model"
          disabled={selectedMake === "" ? true : false}
          data={modelData && [modelData]}
          setSelectedOption={setSelectedModel}
        />
        <CustomSelect placeholder="Price up to (€)" data={make} setSelectedOption={setSelectedMake} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder="First registration from" data={make} setSelectedOption={setSelectedMake} />
        <CustomSelect placeholder="Europe" data={make} setSelectedOption={setSelectedMake} />
        <button
          style={{
            boxShadow: "0 1px 3px 0 rgba(0,0,0,.5)",
          }}
          className="w-full bg-[#f5f200] hover:bg-[#fffb19] rounded-sm text-sm font-medium"
        >
          1240 results
        </button>
      </div>
    </div>
  );
};

const MotorcyclesComponent = ({ make, model }: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const modelData = model[selectedMake];
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder="Make" data={make} setSelectedOption={setSelectedMake} />
        <CustomSelect
          placeholder="Model"
          disabled={selectedMake === "" ? true : false}
          data={modelData && [modelData]}
          setSelectedOption={setSelectedModel}
        />
        <CustomSelect placeholder="Price up to (€)" data={make} setSelectedOption={setSelectedMake} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder="First registration from" data={make} setSelectedOption={setSelectedMake} />
        <CustomSelect placeholder="Europe" data={make} setSelectedOption={setSelectedMake} />
        <button
          style={{
            boxShadow: "0 1px 3px 0 rgba(0,0,0,.5)",
          }}
          className="w-full bg-[#f5f200] hover:bg-[#fffb19] rounded-sm text-sm font-medium"
        >
          1240 results
        </button>
      </div>
    </div>
  );
};

export { MotorcyclesComponent, CarsComponent };
