import FilterSidebar from "@/components/ui/custom/FilterSidebar/FilterSidebar";
import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import { tabsContentData, tabsListData } from "@/utils/tabsData";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsContent={tabsContentData} tabsList={tabsListData} />
        <div className="grid grid-cols-4"></div>
        <div className="md:hidden flex">
          <Sheet>
            <SheetTrigger className="flex items-center gap-2 bg-[#333] text-white px-2 py-1 rounded-sm">
              <SlidersHorizontal width={16} height={16} /> Filters{" "}
              <div className="text-xs bg-white text-[#333] rounded-full w-5 h-5 flex justify-center items-center ml-1">3</div>
            </SheetTrigger>
            <SheetContent side="left">
              <FilterSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </main>
  );
}
