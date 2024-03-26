import { CarsComponent, MotorcyclesComponent } from "@/components/ui/custom/Search/SearchComponents";

let carsSelectData = [
  { label: "Make", options: ["Audi", "Mercedes", "BMW"] },
  { label: "Other", options: ["Opel", "Volkswagen", "SEAT"] },
];

let motorcycleSelectData = [
  { label: "Make", options: ["Yamaha", "Suzuki", "Honda"] },
  { label: "Other", options: ["BMW", "KTM", "CFMoto"] },
];

const tabsListData = [
  { value: "cars", image: "./icons/cars.svg" },
  { value: "motorcycles", image: "./icons/motorcycles.svg" },
];

const tabsContentData = [
  { value: "cars", component: <CarsComponent data={carsSelectData} /> },
  { value: "motorcycles", component: <MotorcyclesComponent data={motorcycleSelectData} /> },
];

export { tabsListData, tabsContentData, carsSelectData, motorcycleSelectData };
