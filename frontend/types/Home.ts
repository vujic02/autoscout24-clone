type vehicleData = { label: string; options: string[] };

type customSelectData = vehicleData[];

type customSelectDataDynamic = {
  [key: string]: vehicleData;
};

type customTabsContent = { value: string; component: JSX.Element }[];

type customTabsList = { value: string; image: string }[];

type SearchFilters = {
  make: string;
  model: string;
  price: string;
  registration: string;
  country: string;
  fuel_type: string;
  body_type: string;
  transmission: string;
  drive_type: string;
  exterior_color: string;
  mileage_from: string;
  mileage_to: string;
  hp_from: string;
  hp_to: string;
  sort: string;
};

export type { vehicleData, customSelectData, customSelectDataDynamic, customTabsContent, customTabsList, SearchFilters };
