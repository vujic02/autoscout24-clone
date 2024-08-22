let carsMakeData = [
  { label: "Make", options: ["Audi", "Mercedes", "BMW"] },
  { label: "Other", options: ["Opel", "Volkswagen", "SEAT"] },
];

let motorcycleMakeData = [
  { label: "Make", options: ["Yamaha", "Suzuki", "Honda"] },
  { label: "Other", options: ["BMW", "KTM", "CFMoto"] },
];

let prices = [
  {
    label: "Price up to (€)",
    options: ["€250", "€500", "€1000", "€1500", "€2000", "€2500", "€3000", "€4000", "€5000", "€6000", "€7000", "€8000", "€€9000", "€10000", "€12500", "€15000", "€17500", "€20000", "€12500", "€15000", "€17500", "€20000", "€30000", "€40000", "€50000", "€75000", "€100000", "€200000", "€300000", "€€400000", "€500000"],
  },
];

let firstRegistration = [
  {
    label: "First registration from",
    options: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960", "1959", "1958", "1957", "1956", "1955", "1954", "1953", "1952", "1951", "1950"],
  },
];

let countries = [{ label: "Europe", options: ["Germany", "Italy", "France"] }];

let carsModelData = {
  Audi: { label: "Model", options: ["A3", "A4", "A5", "A6", "A7"] },
  Mercedes: { label: "Model", options: ["A180", "C200", "E220", "S300", "S500"] },
  BMW: { label: "Model", options: ["320i", "325i", "320d", "520d", "520i"] },
};

let motorcycleModelData = {
  Yamaha: { label: "Model", options: ["YZF-R125", "YZF-R6", "YZF-R7", "YZF-R1", "YZF-R1M", "MT-07", "MT-09"] },
  Suzuki: { label: "Model", options: ["GSX-250R", "GSX-R600", "GSX-R750", "GSX-R1000", "GSX-R1000R", "Hayabusa"] },
  Honda: { label: "Model", options: ["CBR-125R", "CBR-300R", "CBR-500R", "CBR-650R", "CBR-600RR", "CBR-1000RR"] },
};

export { carsMakeData, carsModelData, countries, firstRegistration, motorcycleMakeData, motorcycleModelData, prices };
