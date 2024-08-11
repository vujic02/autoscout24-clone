import FilterSidebar from "@/components/ui/custom/FilterSidebar/FilterSidebar";
import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import { tabsContentData, tabsListData } from "@/utils/tabsData";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsContent={tabsContentData} tabsList={tabsListData} />
        <div className="grid grid-cols-4"></div>
        <FilterSidebar />
      </div>
    </main>
  );
}
