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
    <div>
      <CustomSelect placeholder="Make" data={carsMakeData} setSelectedOption={setSelectedMake} />
      <CustomSelect
        placeholder="Model"
        disabled={selectedMake === "" ? true : false}
        data={modelData && [modelData]}
        setSelectedOption={setSelectedModel}
      />
      <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={setSelectedPrice} />
    </div>
  );
};

export default FilterSidebar;
