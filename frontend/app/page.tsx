"use client";
import BodyTypeSearch from "@/components/ui/custom/BodyTypeSearch/BodyTypeSearch";
import CurrentlyInDemandSearch from "@/components/ui/custom/CurrentlyInDemand/CurrentlyInDemand";
import LastSearchCard from "@/components/ui/custom/LastSearchCard/LastSearchCard";
import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import FeaturedVehicles from "@/components/ui/custom/FeaturedVehicles/FeaturedVehicles";
import { Listing } from "@/lib/api";
import { tabsContentData, tabsListData } from "@/utils/tabsData";
import { useState } from "react";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsContent={tabsContentData} tabsList={tabsListData} />
        <div className="mt-6 flex flex-col gap-4">
          <BodyTypeSearch />
          <div className="flex flex-row justify-between w-full gap-6 mt-6">
            <LastSearchCard title="BMW 320d" subtitle="test" thumbnails={["/testimage.webp", "/testimage.webp"]} />
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
