"use client";
import BodyTypeSearch from "@/components/ui/custom/BodyTypeSearch/BodyTypeSearch";
import CurrentlyInDemandSearch from "@/components/ui/custom/CurrentlyInDemand/CurrentlyInDemand";
import LastSearchCard from "@/components/ui/custom/LastSearchCard/LastSearchCard";
import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import FeaturedVehicles from "@/components/ui/custom/FeaturedVehicles/FeaturedVehicles";
import { getLastSearches, LastSearch } from "@/lib/api";
import { useTranslation, usePageTitle } from "@/lib/i18n";
import { tabsContentData, tabsListData } from "@/utils/tabsData";
import { useState, useEffect } from "react";

export default function Home() {
  const [lastSearches, setLastSearches] = useState<LastSearch[]>([]);
  const { t } = useTranslation();
  usePageTitle(t("titles.home"));

  useEffect(() => {
    setLastSearches(getLastSearches());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsContent={tabsContentData} tabsList={tabsListData} />
        <div className="mt-6 flex flex-col gap-4">
          <BodyTypeSearch />
          <div className="flex flex-row justify-between w-full gap-6 mt-6">
            <LastSearchCard search={lastSearches[0]} />
            <CurrentlyInDemandSearch />
          </div>
        </div>
        <div className="mt-12">
          <FeaturedVehicles />
        </div>
      </div>
    </main>
  );
}
