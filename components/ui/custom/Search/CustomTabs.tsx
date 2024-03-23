import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import CustomSelect from "./CustomSelect";

type Props = {};

const CustomTabs = (props: Props) => {
  // todo
  // tabs trigger napisati u mapu, u propsu pass down: [{value, image}, {value, image}...].
  // tabs content napisati u mapu, u propsu pass down: [{value, JSXComponent}, {value, JSXComponent}...],

  return (
    <Tabs defaultValue="cars">
      <TabsList id="tab-list" className="grid w-[calc(2*90px)] grid-cols-2 !h-[46px] !p-0">
        <TabsTrigger className="w-full max-w-[90px] h-full relative bg-[#dcdcdc] rounded-none" value="cars">
          <Image alt="" src="./icons/cars.svg" width={30} height={22} />
        </TabsTrigger>
        <TabsTrigger className="w-full max-w-[90px] h-full relative bg-[#dcdcdc] rounded-none" value="motorcycles">
          <Image alt="" src="./icons/motorcycles.svg" width={30} height={22} />
        </TabsTrigger>
      </TabsList>
      <TabsContent className="bg-white m-0 p-16" value="cars">
        <CustomSelect />
      </TabsContent>
      <TabsContent value="motorcycles">
        <CustomSelect />
      </TabsContent>
    </Tabs>
  );
};

export default CustomTabs;
