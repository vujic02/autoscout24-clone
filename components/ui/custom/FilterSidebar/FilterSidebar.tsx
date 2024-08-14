"use client";
import React, { useState } from "react";
import CustomSelect from "../Search/CustomSelect";
import { customSelectData, customSelectDataDynamic } from "@/types/Home";
import { carsMakeData, carsModelData, countries, firstRegistration, motorcycleMakeData, motorcycleModelData, prices } from "@/utils/tabsStatic";

interface Props {}

const FilterSidebar = ({}: Props) => {
  const model: customSelectDataDynamic = carsModelData;
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const modelData = model[selectedMake];

  return (
    <div className="bg-white px-4 py-6">
      <label className="text-sm">Make</label>
      <CustomSelect placeholder="Make" data={carsMakeData} setSelectedOption={setSelectedMake} />
      <label className="text-sm">Model</label>
      <CustomSelect
        placeholder="Model"
        disabled={selectedMake === "" ? true : false}
        data={modelData && [modelData]}
        setSelectedOption={setSelectedModel}
      />
      <label className="text-sm">Price</label>
      <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={setSelectedPrice} />
      <label className="text-sm">First registration</label>
      <CustomSelect placeholder="First registration from" data={firstRegistration} setSelectedOption={setSelectedRegistration} />
      <label className="text-sm">Countries</label>
      <CustomSelect placeholder="Europe" data={countries} setSelectedOption={setSelectedCountry} />
    </div>
  );
};

export default FilterSidebar;
