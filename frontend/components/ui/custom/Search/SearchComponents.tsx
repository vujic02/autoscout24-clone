"use client";
import React, { useState } from "react";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { customSelectData, customSelectDataDynamic } from "@/types/Home";
import { useRouter } from "next/navigation";

interface VehicleSelectProps {
  make: customSelectData;
  model: customSelectDataDynamic;
  prices: customSelectData;
  countries: customSelectData;
  firstRegistration: customSelectData;
  fuelTypes?: customSelectData;
}

const CarsComponent = ({ make, model, prices, countries, firstRegistration, fuelTypes }: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const modelData = model[selectedMake];
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    // Strip € symbol from price and send only the number
    if (selectedPrice) params.set("price", selectedPrice.replace("€", "").trim());
    if (selectedRegistration) params.set("registration", selectedRegistration);
    if (selectedFuelType) params.set("fuel_type", selectedFuelType);
    if (selectedCountry) params.set("country", selectedCountry);

    const query = params.toString();
    router.push(`/search${query ? `?${query}` : ""}`);
  };

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
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect placeholder="Europe" data={countries} setSelectedOption={setSelectedCountry} />
          {fuelTypes && <CustomSelect placeholder="Fuel Type" data={fuelTypes} setSelectedOption={setSelectedFuelType} />}
        </div>
        <button
          style={{
            boxShadow: "0 1px 3px 0 rgba(0,0,0,.5)",
          }}
          onClick={() => handleSearch()}
          className="w-full bg-[#f5f200] hover:bg-[#fffb19] rounded-sm text-sm font-medium"
        >
          Search
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
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    // Strip € symbol from price and send only the number
    if (selectedPrice) params.set("price", selectedPrice.replace("€", "").trim());
    if (selectedRegistration) params.set("registration", selectedRegistration);
    if (selectedCountry) params.set("country", selectedCountry);

    const query = params.toString();
    router.push(`/search${query ? `?${query}` : ""}`);
  };

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
          onClick={() => handleSearch()}
          className="w-full bg-[#f5f200] hover:bg-[#fffb19] rounded-sm text-sm font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export { MotorcyclesComponent, CarsComponent };
