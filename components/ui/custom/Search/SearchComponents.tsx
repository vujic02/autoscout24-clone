"use client";
import React, { useState } from "react";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { customSelectData, customSelectDataDynamic } from "@/types/Home";

interface VehicleSelectProps {
  make: customSelectData;
  model: customSelectDataDynamic;
  prices: customSelectData;
  countries: customSelectData;
  firstRegistration: customSelectData;
}

const CarsComponent = ({ make, model, prices, countries, firstRegistration }: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
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
        <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={setSelectedPrice} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder="First registration from" data={firstRegistration} setSelectedOption={setSelectedRegistration} />
        <CustomSelect placeholder="Europe" data={countries} setSelectedOption={setSelectedCountry} />
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

const MotorcyclesComponent = ({ make, model, prices, countries, firstRegistration }: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
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
        <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={setSelectedPrice} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder="First registration from" data={firstRegistration} setSelectedOption={setSelectedRegistration} />
        <CustomSelect placeholder="Europe" data={countries} setSelectedOption={setSelectedCountry} />
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
