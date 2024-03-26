import CustomSelect from "@/components/ui/custom/Search/CustomSelect";

const CarsComponent = () => {
  let data = [
    { label: "Make", options: ["Audi", "Mercedes", "BMW"] },
    { label: "Other", options: ["Opel", "Volkswagen", "SEAT"] },
  ];

  return (
    <div className="">
      <CustomSelect data={data} />
    </div>
  );
};

const MotorcyclesComponent = () => {
  let data = [
    { label: "Make", options: ["Yamaha", "Suzuki", "Honda"] },
    { label: "Other", options: ["BMW", "KTM", "CFMoto"] },
  ];

  return (
    <div className="">
      <CustomSelect data={data} />
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
