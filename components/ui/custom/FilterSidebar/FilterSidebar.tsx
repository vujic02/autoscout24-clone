"use client";
import React, { useState } from "react";
import { customSelectDataDynamic } from "@/types/Home";
import { carsModelData } from "@/utils/tabsStatic";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Sidebar } from "./FilterSidebarComponents";

const FilterSidebar = () => {
  const model: customSelectDataDynamic = carsModelData;
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const modelData = model[selectedMake];

  return (
    <>
      <div className="md:hidden flex">
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 bg-[#333] text-white px-2 py-1 rounded-sm">
            <SlidersHorizontal width={16} height={16} /> Filters{" "}
            <div className="text-xs bg-white text-[#333] rounded-full w-5 h-5 flex justify-center items-center ml-1">3</div>
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar
              modelData={modelData}
              selectedMake={selectedMake}
              setSelectedCountry={setSelectedCountry}
              setSelectedMake={setSelectedMake}
              setSelectedModel={setSelectedModel}
              setSelectedPrice={setSelectedPrice}
              setSelectedRegistration={setSelectedRegistration}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:flex hidden">
        <Sidebar
          modelData={modelData}
          selectedMake={selectedMake}
          setSelectedCountry={setSelectedCountry}
          setSelectedMake={setSelectedMake}
          setSelectedModel={setSelectedModel}
          setSelectedPrice={setSelectedPrice}
          setSelectedRegistration={setSelectedRegistration}
        />
      </div>
    </>
  );
};

export default FilterSidebar;
