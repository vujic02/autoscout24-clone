import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import VehicleCard from "@/components/ui/custom/VehicleCard/VehicleCard";
import VehicleSearchedResult from "@/components/ui/custom/VehicleSearchedResult/VehicleSearchedResult";
import { tabsContentData, tabsListData } from "@/utils/tabsData";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsContent={tabsContentData} tabsList={tabsListData} />
        <div className="grid grid-cols-4"></div>
        <VehicleSearchedResult />
      </div>
    </main>
  );
}
