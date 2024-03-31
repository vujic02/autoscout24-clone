import { CarsComponent, MotorcyclesComponent } from "@/components/ui/custom/Search/SearchComponents";

let carsMakeData = [
  { label: "Make", options: ["Audi", "Mercedes", "BMW"] },
  { label: "Other", options: ["Opel", "Volkswagen", "SEAT"] },
];

let motorcycleMakeData = [
  { label: "Make", options: ["Yamaha", "Suzuki", "Honda"] },
  { label: "Other", options: ["BMW", "KTM", "CFMoto"] },
];

let carsModelData = {
  Audi: { label: "Model", options: ["A3", "A4", "A5", "A6", "A7"] },
  Mercedes: { label: "Model", options: ["A180", "C200", "E220", "S300", "S500"] },
  BMW: { label: "Model", options: ["320i", "325i", "320d", "520d", "520i"] },
};

let motorcycleModelData = [
  { label: "Make", options: ["Yamaha", "Suzuki", "Honda"] },
  { label: "Other", options: ["BMW", "KTM", "CFMoto"] },
];

const tabsListData = [
  { value: "cars", image: "./icons/cars.svg" },
  { value: "motorcycles", image: "./icons/motorcycles.svg" },
];

const tabsContentData = [
  { value: "cars", component: <CarsComponent make={carsMakeData} model={carsModelData} /> },
  { value: "motorcycles", component: <MotorcyclesComponent make={motorcycleMakeData} model={motorcycleModelData} /> },
];

export { tabsListData, tabsContentData };
