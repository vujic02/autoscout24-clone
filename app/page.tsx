import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import { tabsListData } from "@/utils/tabsData";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="max-w-[1100px] w-full">
        <CustomTabs tabsList={tabsListData} />
      </div>
    </main>
  );
}
