import React from "react";
import { useTranslation } from "@/lib/i18n";

const FooterTop = () => {
  const { t } = useTranslation();

  return (
    <div id="top-footer" className="px-4">
      <div className="text-sm text-gray-500 font-light">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">1</sup>
        {t("footer.vatDeductible")}
      </div>
      <div className="text-sm text-gray-500 font-light mt-2">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">2</sup>
        {t("footer.fuelConsumptionNotice")}
      </div>
      <div className="text-sm text-gray-500 font-light mt-2 ">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">7</sup>
        {t("footer.measurementNotice")}
      </div>
      <div className="text-sm text-gray-500 font-light mt-2">
        <sup className="text-xs top-auto -bottom-0.5 mr-1.5 -z-10">8</sup>
        {t("footer.approximateValuesNotice")}
      </div>
    </div>
  );
};

export default FooterTop;
