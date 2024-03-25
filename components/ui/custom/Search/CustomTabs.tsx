import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import CustomSelect from "./CustomSelect";

type Props = {
  tabsList: { value: string; image: string }[];
  tabsContent: { value: string; component: JSX.Element }[];
};

const CustomTabs = ({ tabsList, tabsContent }: Props) => {
  // todo
  // tabs trigger napisati u mapu, u propsu pass down: [{value, image}, {value, image}...].
  // tabs content napisati u mapu, u propsu pass down: [{value, JSXComponent}, {value, JSXComponent}...],

  return (
    <Tabs defaultValue="cars">
      <TabsList id="tab-list" className="grid w-[calc(2*90px)] grid-cols-2 gap-x-[1px] !h-[46px] !p-0">
        {tabsList.map((list, id) => (
          <TabsTrigger key={id} className="w-full max-w-[90px] h-full relative bg-[#dcdcdc] rounded-none" value={list.value}>
            <Image alt="" src={list.image} width={30} height={22} />
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsContent.map((content, id) => (
        <TabsContent className="bg-white m-0 p-4" value={content.value} key={id}>
          {content.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CustomTabs;
