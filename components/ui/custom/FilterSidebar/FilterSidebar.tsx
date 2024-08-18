"use client";
import React, { useState } from "react";
import CustomSelect from "../Search/CustomSelect";
import { customSelectData, customSelectDataDynamic } from "@/types/Home";
import { carsMakeData, carsModelData, countries, firstRegistration, motorcycleMakeData, motorcycleModelData, prices } from "@/utils/tabsStatic";
import { Badge } from "@/components/ui/badge";

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
      <div className="py-4 px-2 min-h-36">
        <p className="text-base text-[#333] font-semibold mt-2">My search (2)</p>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary">Europe</Badge>
          <Badge variant="secondary">BMW</Badge>
        </div>
      </div>
      <div className="border-t border-t-[#dcdcdc] py-2">
        <div className="flex flex-col gap-y-3 px-2 mt-2">
          <p className="text-[#333] text-base font-semibold">Basic specifications & Location</p>
          <div>
            <label className="inline-block text-base mb-0.5 mt-6">Make</label>
            <CustomSelect placeholder="Make" data={carsMakeData} setSelectedOption={setSelectedMake} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Model</label>
            <CustomSelect
              placeholder="Model"
              disabled={selectedMake === "" ? true : false}
              data={modelData && [modelData]}
              setSelectedOption={setSelectedModel}
            />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Price</label>
            <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={setSelectedPrice} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">First registration</label>
            <CustomSelect placeholder="First registration from" data={firstRegistration} setSelectedOption={setSelectedRegistration} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Countries</label>
            <CustomSelect placeholder="Europe" data={countries} setSelectedOption={setSelectedCountry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
