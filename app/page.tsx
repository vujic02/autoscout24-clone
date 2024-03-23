import CustomTabs from "@/components/ui/custom/Search/CustomTabs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CustomTabs />
    </main>
  );
}
