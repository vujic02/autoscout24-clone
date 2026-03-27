type vehicleData = { label: string; options: string[] };

type customSelectData = vehicleData[];

type customSelectDataDynamic = {
  [key: string]: vehicleData;
};

type customTabsContent = { value: string; component: JSX.Element }[];

type customTabsList = { value: string; image: string }[];

export type { vehicleData, customSelectData, customSelectDataDynamic, customTabsContent, customTabsList };
