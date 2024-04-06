import React from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";

type Props = {};

const VehicleCard = (props: Props) => {
  return (
    <div className="relative flex flex-col hover:shadow-md transition-all cursor-pointer border border-transparent active:border-black rounded-md">
      <div className="bg-[#eaeaea] flex justify-center items-center w-full h-48 rounded-t-sm">
        <svg viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg" width="50px">
          <path
            d="M12.5 0c.7 0 1.3.4 1.7 1l2.4 4H18c2.2 0 4 1.8 4 4v3c0 1.1-.9 2-2 2h-1.2c-.4 1.2-1.5 2-2.8 2-1.3 0-2.4-.8-2.8-2H8.8c-.4 1.2-1.5 2-2.8 2-1.3 0-2.4-.8-2.8-2H2c-1.1 0-2-.9-2-2V6.3c0-.3.1-.7.3-1L2.9 1c.3-.6 1-1 1.7-1ZM6 12c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1Zm10 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1ZM12.5 2H4.6L2.8 5H5c.6 0 1 .4 1 1s-.4 1-1 1H2v5h1.2c.4-1.2 1.5-2 2.8-2 1.3 0 2.4.8 2.8 2h4.4c.4-1.2 1.5-2 2.8-2 1.3 0 2.4.8 2.8 2h1.3V9c0-1.1-.9-2-2-2h-2c-.4 0-.7-.2-.9-.5L12.5 2ZM11 4c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1s-1-.4-1-1V5c0-.6.4-1 1-1Z"
            fill="#fff"
            fill-rule="nonzero"
          ></path>
        </svg>
        {/* <img
          className="object-cover w-full h-full rounded-t-sm"
          src="https://www.webike.es/magazine/wp-content/uploads/2022/12/12_yamaha_yzfr6_01.jpg?v=1670803633"
          alt="#"
        /> */}
      </div>
      <div className="border border-[#eaeaea] bg-white flex flex-col p-2 rounded-b-sm">
        <h6 className="font-medium">Yamaha YZF-R6</h6>
        <h4 className="font-semibold mt-1">€ 9,500.-</h4>
        <p className="text-sm mt-1">
          <span>05/2022</span> | <span>Gasoline</span> | <span>14,031 km</span>
        </p>
        <div className="inline-flex mt-2">
          <span className="bg-[#f4f4f4] rounded-md px-2 py-1 w-auto text-xs font-light">Private</span>
        </div>
        <div className="flex items-center mt-1">
          <MapPin width={12} height={14} />
          <p className="text-sm mt-0.5 ml-1">IT 24059 Urgnano</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
