"use client";
import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
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
  const { t } = useTranslation();
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
        <p className="text-base text-[#333] font-semibold mt-2">
          {t("filters.mySearch")}
          {allActiveCount > 0 && ` (${allActiveCount})`}
        </p>
        {(activeBasicFilters.length > 0 || activeRefineFilters.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.country && <Badge variant="secondary">{filters.country}</Badge>}
            {filters.make && <Badge variant="secondary">{filters.make}</Badge>}
            {filters.model && <Badge variant="secondary">{filters.model}</Badge>}
            {filters.price && <Badge variant="secondary">{t("filters.upToPrice", { price: filters.price })}</Badge>}
            {filters.registration && <Badge variant="secondary">{t("filters.fromYear", { year: filters.registration })}</Badge>}
            {filters.fuel_type && <Badge variant="secondary">{filters.fuel_type}</Badge>}
            {filters.body_type && <Badge variant="secondary">{filters.body_type}</Badge>}
            {filters.transmission && <Badge variant="secondary">{filters.transmission}</Badge>}
            {filters.drive_type && <Badge variant="secondary">{filters.drive_type}</Badge>}
            {filters.exterior_color && <Badge variant="secondary">{filters.exterior_color}</Badge>}
            {filters.mileage_from && <Badge variant="secondary">{t("filters.mileageGte", { value: filters.mileage_from })}</Badge>}
            {filters.mileage_to && <Badge variant="secondary">{t("filters.mileageLte", { value: filters.mileage_to })}</Badge>}
            {filters.hp_from && <Badge variant="secondary">{t("filters.hpGte", { value: filters.hp_from })}</Badge>}
            {filters.hp_to && <Badge variant="secondary">{t("filters.hpLte", { value: filters.hp_to })}</Badge>}
          </div>
        )}
        {totalCount !== undefined && (
          <p className="text-sm text-gray-500 mt-2">
            {totalCount} {t("filters.vehiclesFound")}
          </p>
        )}
      </div>
      <div className="border-t border-t-[#dcdcdc] py-2">
        <div className="flex flex-col gap-y-3 px-1 mt-2">
          <p className="text-[#333] text-base font-semibold">{t("filters.basicSpecifications")}</p>
          <div>
            <label className="inline-block text-sm mb-0.5 mt-4">{t("filters.make")}</label>
            <CustomSelect placeholder={t("filters.make")} data={carsMakeData} setSelectedOption={(v) => updateFilter("make", v)} value={filters.make} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">{t("filters.model")}</label>
            <CustomSelect
              placeholder={t("filters.model")}
              disabled={filters.make === "" ? true : false}
              data={modelData && [modelData]}
              setSelectedOption={(v) => updateFilter("model", v)}
              value={filters.model}
            />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">{t("filters.price")}</label>
            <CustomSelect placeholder={t("filters.priceUpTo")} data={prices} setSelectedOption={(v) => updateFilter("price", v)} value={filters.price} />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">{t("filters.firstRegistration")}</label>
            <CustomSelect
              placeholder={t("filters.firstRegistrationFrom")}
              data={firstRegistration}
              setSelectedOption={(v) => updateFilter("registration", v)}
              value={filters.registration}
            />
          </div>
          <div>
            <label className="inline-block text-base mb-0.5">{t("filters.countries")}</label>
            <CustomSelect placeholder={t("filters.europe")} data={countries} setSelectedOption={(v) => updateFilter("country", v)} value={filters.country} />
          </div>
        </div>
      </div>

      {/* Refine search */}
      <div className="border-t border-t-[#dcdcdc] py-2">
        <button
          onClick={() => setRefineOpen(!refineOpen)}
          className="flex items-center justify-between w-full px-1 py-2 text-[#1166a8] text-sm font-medium hover:underline"
        >
          {t("filters.refineSearch")}
          {activeRefineFilters.length > 0 && ` (${activeRefineFilters.length})`}
          {refineOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {refineOpen && (
          <div className="flex flex-col gap-y-3 px-1 mt-1">
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.fuelType")}</label>
              <CustomSelect placeholder={t("filters.any")} data={fuelTypes} setSelectedOption={(v) => updateFilter("fuel_type", v)} value={filters.fuel_type} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.bodyType")}</label>
              <CustomSelect placeholder={t("filters.any")} data={bodyTypes} setSelectedOption={(v) => updateFilter("body_type", v)} value={filters.body_type} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.transmission")}</label>
              <CustomSelect placeholder={t("filters.any")} data={transmissions} setSelectedOption={(v) => updateFilter("transmission", v)} value={filters.transmission} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.driveType")}</label>
              <CustomSelect placeholder={t("filters.any")} data={driveTypes} setSelectedOption={(v) => updateFilter("drive_type", v)} value={filters.drive_type} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.exteriorColor")}</label>
              <CustomSelect placeholder={t("filters.any")} data={colors} setSelectedOption={(v) => updateFilter("exterior_color", v)} value={filters.exterior_color} />
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.mileage")}</label>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect
                  placeholder={t("filters.from")}
                  data={mileageOptions}
                  setSelectedOption={(v) => updateFilter("mileage_from", v)}
                  value={filters.mileage_from}
                />
                <CustomSelect placeholder={t("filters.to")} data={mileageOptions} setSelectedOption={(v) => updateFilter("mileage_to", v)} value={filters.mileage_to} />
              </div>
            </div>
            <div>
              <label className="inline-block text-sm mb-0.5">{t("filters.horsepower")}</label>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect placeholder={t("filters.from")} data={horsepowerOptions} setSelectedOption={(v) => updateFilter("hp_from", v)} value={filters.hp_from} />
                <CustomSelect placeholder={t("filters.to")} data={horsepowerOptions} setSelectedOption={(v) => updateFilter("hp_to", v)} value={filters.hp_to} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Sidebar };
