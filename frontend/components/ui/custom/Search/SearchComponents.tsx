"use client";
import React, { useState } from "react";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { customSelectData, customSelectDataDynamic } from "@/types/Home";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface VehicleSelectProps {
  make: customSelectData;
  model: customSelectDataDynamic;
  prices: customSelectData;
  countries: customSelectData;
  firstRegistration: customSelectData;
  fuelTypes?: customSelectData;
  bodyTypes?: customSelectData;
  transmissions?: customSelectData;
  driveTypes?: customSelectData;
  colors?: customSelectData;
  mileageOptions?: customSelectData;
  horsepowerOptions?: customSelectData;
}

const CarsComponent = ({
  make,
  model,
  prices,
  countries,
  firstRegistration,
  fuelTypes,
  bodyTypes,
  transmissions,
  driveTypes,
  colors,
  mileageOptions,
  horsepowerOptions,
}: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedDriveType, setSelectedDriveType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMileageFrom, setSelectedMileageFrom] = useState("");
  const [selectedMileageTo, setSelectedMileageTo] = useState("");
  const [selectedHpFrom, setSelectedHpFrom] = useState("");
  const [selectedHpTo, setSelectedHpTo] = useState("");
  const modelData = model[selectedMake];
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    // Strip € symbol from price and send only the number
    if (selectedPrice) params.set("price", selectedPrice.replace("€", "").trim());
    if (selectedRegistration) params.set("registration", selectedRegistration);
    if (selectedFuelType) params.set("fuel_type", selectedFuelType);
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedBodyType) params.set("body_type", selectedBodyType);
    if (selectedTransmission) params.set("transmission", selectedTransmission);
    if (selectedDriveType) params.set("drive_type", selectedDriveType);
    if (selectedColor) params.set("exterior_color", selectedColor);
    if (selectedMileageFrom) params.set("mileage_from", selectedMileageFrom.replace(/,/g, ""));
    if (selectedMileageTo) params.set("mileage_to", selectedMileageTo.replace(/,/g, ""));
    if (selectedHpFrom) params.set("hp_from", selectedHpFrom);
    if (selectedHpTo) params.set("hp_to", selectedHpTo);

    const query = params.toString();
    router.push(`/search${query ? `?${query}` : ""}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder={t("filters.make")} data={make} setSelectedOption={setSelectedMake} />
        <CustomSelect
          placeholder={t("filters.model")}
          disabled={selectedMake === "" ? true : false}
          data={modelData && [modelData]}
          setSelectedOption={setSelectedModel}
        />
        <CustomSelect placeholder={t("filters.priceUpTo")} data={prices} setSelectedOption={setSelectedPrice} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder={t("filters.firstRegistrationFrom")} data={firstRegistration} setSelectedOption={setSelectedRegistration} />
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect placeholder={t("filters.europe")} data={countries} setSelectedOption={setSelectedCountry} />
          {fuelTypes && <CustomSelect placeholder={t("filters.fuelType")} data={fuelTypes} setSelectedOption={setSelectedFuelType} />}
        </div>
        <button
          style={{
            boxShadow: "0 1px 3px 0 rgba(0,0,0,.5)",
          }}
          onClick={() => handleSearch()}
          className="w-full bg-[#f5f200] hover:bg-[#fffb19] rounded-sm text-sm font-medium"
        >
          {t("common.search")}
        </button>
      </div>

      {showRefine && (
        <div className="flex flex-col gap-3 pt-1">
          <div className="grid grid-cols-3 gap-3">
            {bodyTypes && <CustomSelect placeholder={t("filters.bodyType")} data={bodyTypes} setSelectedOption={setSelectedBodyType} />}
            {transmissions && <CustomSelect placeholder={t("filters.transmission")} data={transmissions} setSelectedOption={setSelectedTransmission} />}
            {driveTypes && <CustomSelect placeholder={t("filters.driveType")} data={driveTypes} setSelectedOption={setSelectedDriveType} />}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {colors && <CustomSelect placeholder={t("filters.exteriorColor")} data={colors} setSelectedOption={setSelectedColor} />}
            {mileageOptions && <CustomSelect placeholder={t("filters.mileageFrom")} data={mileageOptions} setSelectedOption={setSelectedMileageFrom} />}
            {mileageOptions && <CustomSelect placeholder={t("filters.mileageTo")} data={mileageOptions} setSelectedOption={setSelectedMileageTo} />}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {horsepowerOptions && <CustomSelect placeholder={t("filters.hpFrom")} data={horsepowerOptions} setSelectedOption={setSelectedHpFrom} />}
            {horsepowerOptions && <CustomSelect placeholder={t("filters.hpTo")} data={horsepowerOptions} setSelectedOption={setSelectedHpTo} />}
            <div />
          </div>
        </div>
      )}

      <button
        onClick={() => setShowRefine(!showRefine)}
        className="flex items-center justify-center gap-1 text-[#2a6dc9] text-sm font-medium hover:underline cursor-pointer mx-auto"
      >
        {t("filters.refineSearch")}
        {showRefine ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  );
};

const MotorcyclesComponent = ({
  make,
  model,
  prices,
  countries,
  firstRegistration,
  transmissions,
  driveTypes,
  colors,
  mileageOptions,
  horsepowerOptions,
}: VehicleSelectProps) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedDriveType, setSelectedDriveType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMileageFrom, setSelectedMileageFrom] = useState("");
  const [selectedMileageTo, setSelectedMileageTo] = useState("");
  const [selectedHpFrom, setSelectedHpFrom] = useState("");
  const [selectedHpTo, setSelectedHpTo] = useState("");
  const modelData = model[selectedMake];
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = () => {
    const params = new URLSearchParams();

    params.set("body_type", "motorcycle");
    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    // Strip € symbol from price and send only the number
    if (selectedPrice) params.set("price", selectedPrice.replace("€", "").trim());
    if (selectedRegistration) params.set("registration", selectedRegistration);
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedTransmission) params.set("transmission", selectedTransmission);
    if (selectedDriveType) params.set("drive_type", selectedDriveType);
    if (selectedColor) params.set("exterior_color", selectedColor);
    if (selectedMileageFrom) params.set("mileage_from", selectedMileageFrom.replace(/,/g, ""));
    if (selectedMileageTo) params.set("mileage_to", selectedMileageTo.replace(/,/g, ""));
    if (selectedHpFrom) params.set("hp_from", selectedHpFrom);
    if (selectedHpTo) params.set("hp_to", selectedHpTo);

    const query = params.toString();
    router.push(`/search${query ? `?${query}` : ""}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder={t("filters.make")} data={make} setSelectedOption={setSelectedMake} />
        <CustomSelect
          placeholder={t("filters.model")}
          disabled={selectedMake === "" ? true : false}
          data={modelData && [modelData]}
          setSelectedOption={setSelectedModel}
        />
        <CustomSelect placeholder={t("filters.priceUpTo")} data={prices} setSelectedOption={setSelectedPrice} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <CustomSelect placeholder={t("filters.firstRegistrationFrom")} data={firstRegistration} setSelectedOption={setSelectedRegistration} />
        <CustomSelect placeholder={t("filters.europe")} data={countries} setSelectedOption={setSelectedCountry} />
        <button
          style={{
            boxShadow: "0 1px 3px 0 rgba(0,0,0,.5)",
          }}
          onClick={() => handleSearch()}
          className="w-full bg-[#f5f200] hover:bg-[#fffb19] rounded-sm text-sm font-medium"
        >
          {t("common.search")}
        </button>
      </div>

      {showRefine && (
        <div className="flex flex-col gap-3 pt-1">
          <div className="grid grid-cols-3 gap-3">
            {transmissions && <CustomSelect placeholder={t("filters.transmission")} data={transmissions} setSelectedOption={setSelectedTransmission} />}
            {driveTypes && <CustomSelect placeholder={t("filters.driveType")} data={driveTypes} setSelectedOption={setSelectedDriveType} />}
            {colors && <CustomSelect placeholder={t("filters.exteriorColor")} data={colors} setSelectedOption={setSelectedColor} />}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mileageOptions && <CustomSelect placeholder={t("filters.mileageFrom")} data={mileageOptions} setSelectedOption={setSelectedMileageFrom} />}
            {mileageOptions && <CustomSelect placeholder={t("filters.mileageTo")} data={mileageOptions} setSelectedOption={setSelectedMileageTo} />}
            {horsepowerOptions && <CustomSelect placeholder={t("filters.hpFrom")} data={horsepowerOptions} setSelectedOption={setSelectedHpFrom} />}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {horsepowerOptions && <CustomSelect placeholder={t("filters.hpTo")} data={horsepowerOptions} setSelectedOption={setSelectedHpTo} />}
            <div />
            <div />
          </div>
        </div>
      )}

      <button
        onClick={() => setShowRefine(!showRefine)}
        className="flex items-center justify-center gap-1 text-[#2a6dc9] text-sm font-medium hover:underline cursor-pointer mx-auto"
      >
        {t("filters.refineSearch")}
        {showRefine ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  );
};

export { MotorcyclesComponent, CarsComponent };
