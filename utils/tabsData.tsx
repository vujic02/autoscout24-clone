import CustomSelect from "@/components/ui/custom/Search/CustomSelect";

const CarsComponent = () => {
  return (
    <div className="">
      <CustomSelect />
    </div>
  );
};

const MotorcyclesComponent = () => {
  return (
    <div className="">
      <CustomSelect />
    </div>
  );
};

const tabsListData = [
  { value: "cars", image: "./icons/cars.svg" },
  { value: "motorcycles", image: "./icons/motorcycles.svg" },
];

const tabsContentData = [
  { value: "cars", component: <CarsComponent /> },
  { value: "motorcycles", component: <MotorcyclesComponent /> },
];

export { tabsListData, tabsContentData };
