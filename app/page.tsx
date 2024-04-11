import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import VehicleCard from "@/components/ui/custom/VehicleCard/VehicleCard";
import { tabsContentData, tabsListData } from "@/utils/tabsData";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsContent={tabsContentData} tabsList={tabsListData} />
        <div className="grid grid-cols-4">
          <VehicleCard
            name="Yamaha YZF-R6"
            price={9000}
            fuelType="Gasoline"
            kilometerage={34525}
            location="IT 2462"
            registration={new Date("6/22/2022")}
            image="https://www.mitchellsmc.co.uk/wp-content/uploads/2023/05/DSC05578-scaled.jpg"
          />
        </div>
      </div>
    </main>
  );
}
