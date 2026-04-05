"use client";
import React, { useState } from "react";
import CustomSelect from "../Search/CustomSelect";
import {
  carsMakeData,
  countries,
  firstRegistration,
  prices,
  fuelTypes,
  transmissions,
  driveTypes,
  colors,
  bodyTypes,
  mileageOptions,
  horsepowerOptions,
} from "@/utils/tabsStatic";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { vehicleData, SearchFilters } from "@/types/Home";

type Props = {
  modelData: vehicleData;
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: string) => void;
  totalCount?: number;
};

const Sidebar = ({ modelData, filters, updateFilter, totalCount }: Props) => {
  const [refineOpen, setRefineOpen] = useState(false);

  const activeBasicFilters = [filters.make, filters.model, filters.price, filters.registration, filters.country].filter(Boolean);
  const activeRefineFilters = [
    filters.fuel_type,
    filters.body_type,
    filters.transmission,
    filters.drive_type,
    filters.exterior_color,
    filters.mileage_from,
    filters.mileage_to,
    filters.hp_from,
    filters.hp_to,
  ].filter(Boolean);
  const allActiveCount = activeBasicFilters.length + activeRefineFilters.length;

  return (
    <div className="bg-white px-3 py-4">
      <div className="py-2 px-1 min-h-16">
        <p className="text-base text-[#333] font-semibold mt-2">My search{allActiveCount > 0 && ` (${allActiveCount})`}</p>
        {(activeBasicFilters.length > 0 || activeRefineFilters.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.country && <Badge variant="secondary">{filters.country}</Badge>}
            {filters.make && <Badge variant="secondary">{filters.make}</Badge>}
            {filters.model && <Badge variant="secondary">{filters.model}</Badge>}
            {filters.price && <Badge variant="secondary">up to €{filters.price}</Badge>}
            {filters.registration && <Badge variant="secondary">from {filters.registration}</Badge>}
            {filters.fuel_type && <Badge variant="secondary">{filters.fuel_type}</Badge>}
            {filters.body_type && <Badge variant="secondary">{filters.body_type}</Badge>}
            {filters.transmission && <Badge variant="secondary">{filters.transmission}</Badge>}
            {filters.drive_type && <Badge variant="secondary">{filters.drive_type}</Badge>}
            {filters.exterior_color && <Badge variant="secondary">{filters.exterior_color}</Badge>}
            {filters.mileage_from && <Badge variant="secondary">≥{filters.mileage_from} km</Badge>}
            {filters.mileage_to && <Badge variant="secondary">≤{filters.mileage_to} km</Badge>}
            {filters.hp_from && <Badge variant="secondary">≥{filters.hp_from} hp</Badge>}
            {filters.hp_to && <Badge variant="secondary">≤{filters.hp_to} hp</Badge>}
          </div>
        )}
        {totalCount !== undefined && <p className="text-sm text-gray-500 mt-2">{totalCount} vehicles found</p>}
      </div>
      <div className="border-t border-t-[#dcdcdc] py-2">
        <div className="flex flex-col gap-y-3 px-1 mt-2">
          <p className="text-[#333] text-base font-semibold">Basic specifications & Location</p>
          <div>
            <label className="inline-block text-sm mb-0.5 mt-4">Make</label>
            <CustomSelect placeholder="Make" data={carsMakeData} setSelectedOption={(v) => updateFilter("make", v)} value={filters.make} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Model</label>
            <CustomSelect
              placeholder="Model"
              disabled={filters.make === "" ? true : false}
              data={modelData && [modelData]}
              setSelectedOption={(v) => updateFilter("model", v)}
              value={filters.model}
            />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Price</label>
            <CustomSelect placeholder="Price up to (€)" data={prices} setSelectedOption={(v) => updateFilter("price", v)} value={filters.price} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">First registration</label>
            <CustomSelect
              placeholder="First registration from"
              data={firstRegistration}
              setSelectedOption={(v) => updateFilter("registration", v)}
              value={filters.registration}
            />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">Countries</label>
            <CustomSelect placeholder="Europe" data={countries} setSelectedOption={(v) => updateFilter("country", v)} value={filters.country} />
          </div>
        </div>
      </div>

      {/* Refine search */}
      <div className="border-t border-t-[#dcdcdc] py-2">
        <button
          onClick={() => setRefineOpen(!refineOpen)}
          className="flex items-center justify-between w-full px-1 py-2 text-[#1166a8] text-sm font-medium hover:underline"
        >
          Refine search{activeRefineFilters.length > 0 && ` (${activeRefineFilters.length})`}
          {refineOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {refineOpen && (
          <div className="flex flex-col gap-y-3 px-1 mt-1">
            <div>
              <label className="inline-block text-sm mb-0.5">Fuel type</label>
              <CustomSelect placeholder="Any" data={fuelTypes} setSelectedOption={(v) => updateFilter("fuel_type", v)} value={filters.fuel_type} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">Body type</label>
              <CustomSelect placeholder="Any" data={bodyTypes} setSelectedOption={(v) => updateFilter("body_type", v)} value={filters.body_type} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">Transmission</label>
              <CustomSelect placeholder="Any" data={transmissions} setSelectedOption={(v) => updateFilter("transmission", v)} value={filters.transmission} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">Drive type</label>
              <CustomSelect placeholder="Any" data={driveTypes} setSelectedOption={(v) => updateFilter("drive_type", v)} value={filters.drive_type} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">Exterior color</label>
              <CustomSelect placeholder="Any" data={colors} setSelectedOption={(v) => updateFilter("exterior_color", v)} value={filters.exterior_color} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">Mileage</label>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect placeholder="From" data={mileageOptions} setSelectedOption={(v) => updateFilter("mileage_from", v)} value={filters.mileage_from} />
                <CustomSelect placeholder="To" data={mileageOptions} setSelectedOption={(v) => updateFilter("mileage_to", v)} value={filters.mileage_to} />
              </div>
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">Horsepower</label>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect placeholder="From" data={horsepowerOptions} setSelectedOption={(v) => updateFilter("hp_from", v)} value={filters.hp_from} />
                <CustomSelect placeholder="To" data={horsepowerOptions} setSelectedOption={(v) => updateFilter("hp_to", v)} value={filters.hp_to} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Sidebar };
