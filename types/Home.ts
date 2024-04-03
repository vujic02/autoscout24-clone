type customSelectData = { label: string; options: string[] }[];

type customSelectDataDynamic = {
  [key: string]: { label: string; options: string[] };
};

type customTabsContent = { value: string; component: JSX.Element }[];

type customTabsList = { value: string; image: string }[];

export type { customSelectData, customSelectDataDynamic, customTabsContent, customTabsList };
