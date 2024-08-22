import React from "react";

const FooterTop = () => {
  return (
    <div id="top-footer" className="px-4">
      <div className="text-sm text-gray-500 font-light">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">1</sup>VAT deductible
      </div>
      <div className="text-sm text-gray-500 font-light mt-2">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">2</sup>You can obtain more information on the official fuel consumption and
        official specific CO2 emissions of new passenger vehicles from the guideline on fuel consumption and CO2 emissions of new passenger vehicles.
        This guideline is available free of charge at all dealerships and from Deutsche Automobil Treuhand GmbH at www.dat.de.
      </div>
      <div className="text-sm text-gray-500 font-light mt-2 ">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">7</sup>The values stated were determined according to the prescribed measurement
        procedure (in accordance with the Passenger Car Energy Consumption Labelling Ordinance (PKW-EnVKV) in the respective applicable version). The
        data refers to the vehicle model offered and is used for comparison purposes between the different vehicle types.
      </div>
      <div className="text-sm text-gray-500 font-light mt-2">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">8</sup>The field displays approximate values provided by the creator of the offer.
        The values may represent experiences with this model or originate from other sources.
      </div>
    </div>
  );
};

export default FooterTop;
