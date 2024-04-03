import { CarsComponent, MotorcyclesComponent } from "@/components/ui/custom/Search/SearchComponents";
import { carsMakeData, carsModelData, countries, firstRegistration, motorcycleMakeData, motorcycleModelData, prices } from "./tabsStatic";

const tabsListData = [
  { value: "cars", image: "./icons/cars.svg" },
  { value: "motorcycles", image: "./icons/motorcycles.svg" },
];

const tabsContentData = [
  {
    value: "cars",
    component: <CarsComponent make={carsMakeData} model={carsModelData} prices={prices} firstRegistration={firstRegistration} countries={countries} />,
  },
  {
    value: "motorcycles",
    component: <MotorcyclesComponent make={motorcycleMakeData} model={motorcycleModelData} prices={prices} firstRegistration={firstRegistration} countries={countries} />,
  },
];

export { tabsContentData, tabsListData };
