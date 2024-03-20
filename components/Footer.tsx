"use client";
import React from "react";
import { ArrowUpToLine } from "lucide-react";

type Props = {};

const Footer = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-[1100px] w-full">
        <div id="top-footer">
          <div className="text-sm text-gray-500 font-light">
            <sup className="text-xs top-auto -bottom-0.5 mr-1.5">1</sup>VAT deductible
          </div>
          <div className="text-sm text-gray-500 font-light mt-2">
            <sup className="text-xs top-auto -bottom-0.5 mr-1.5">2</sup>You can obtain more information on the official fuel consumption and official
            specific CO2 emissions of new passenger vehicles from the guideline on fuel consumption and CO2 emissions of new passenger vehicles. This
            guideline is available free of charge at all dealerships and from Deutsche Automobil Treuhand GmbH at www.dat.de.
          </div>
          <div className="text-sm text-gray-500 font-light mt-2">
            <sup className="text-xs top-auto -bottom-0.5 mr-1.5">7</sup>The values stated were determined according to the prescribed measurement
            procedure (in accordance with the Passenger Car Energy Consumption Labelling Ordinance (PKW-EnVKV) in the respective applicable version).
            The data refers to the vehicle model offered and is used for comparison purposes between the different vehicle types.
          </div>
          <div className="text-sm text-gray-500 font-light mt-2">
            <sup className="text-xs top-auto -bottom-0.5 mr-1.5">8</sup>The field displays approximate values provided by the creator of the offer.
            The values may represent experiences with this model or originate from other sources.
          </div>
        </div>
        <div id="mid-footer" className="mt-8 border-t border-b border-gray-300 py-4 w-full flex justify-end">
          <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-blue-600 flex items-center font-light" href="">
            To the top
            <ArrowUpToLine className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
