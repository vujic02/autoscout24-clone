"use client";
import React from "react";
import CustomSelect from "../Search/CustomSelect";
import { carsMakeData, countries, firstRegistration, prices } from "@/utils/tabsStatic";
import { Badge } from "@/components/ui/badge";
import { vehicleData } from "@/types/Home";

type Props = {
  modelData: vehicleData;
  selectedMake: string;
  selectedModel: string;
  selectedPrice: string;
  selectedRegistration: string;
  selectedCountry: string;
  setSelectedMake: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string>>;
  setSelectedRegistration: React.Dispatch<React.SetStateAction<string>>;
  totalCount?: number;
};

const Sidebar = ({
  modelData,
  selectedMake,
  selectedModel,
  selectedPrice,
  selectedRegistration,
  selectedCountry,
  setSelectedMake,
  setSelectedCountry,
  setSelectedModel,
  setSelectedPrice,
  setSelectedRegistration,
  totalCount,
}: Props) => {
  const activeFilters = [selectedMake, selectedModel, selectedPrice, selectedRegistration, selectedCountry].filter(Boolean);

  return (
    <div className="bg-white px-3 py-4">
      <div className="py-2 px-1 min-h-16">
        <p className="text-base text-[#333] font-semibold mt-2">My search{activeFilters.length > 0 && ` (${activeFilters.length})`}</p>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedCountry && <Badge variant="secondary">{selectedCountry}</Badge>}
            {selectedMake && <Badge variant="secondary">{selectedMake}</Badge>}
            {selectedModel && <Badge variant="secondary">{selectedModel}</Badge>}
            {selectedPrice && <Badge variant="secondary">up to €{selectedPrice}</Badge>}
            {selectedRegistration && <Badge variant="secondary">from {selectedRegistration}</Badge>}
          </div>
        )}
        {totalCount !== undefined && <p className="text-sm text-gray-500 mt-2">{totalCount} vehicles found</p>}
      </div>
      <div className="border-t border-t-[#dcdcdc] py-2">
        <div className="flex flex-col gap-y-3 px-1 mt-2">
          <p className="text-[#333] text-base font-semibold">Basic specifications & Location</p>
          <div>
            <label className="inline-block text-sm mb-0.5 mt-4">Make</label>
            <CustomSelect placeholder="Make" data={carsMakeData} setSelectedOption={setSelectedMake} value={selectedMake} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Model</label>
            <CustomSelect
              placeholder="Model"
              disabled={selectedMake === "" ? true : false}
              data={modelData && [modelData]}
              setSelectedOption={setSelectedModel}
              value={selectedModel}
            />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Price</label>
            <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={setSelectedPrice} value={selectedPrice} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">First registration</label>
            <CustomSelect placeholder="First registration from" data={firstRegistration} setSelectedOption={setSelectedRegistration} value={selectedRegistration} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Countries</label>
            <CustomSelect placeholder="Europe" data={countries} setSelectedOption={setSelectedCountry} value={selectedCountry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
