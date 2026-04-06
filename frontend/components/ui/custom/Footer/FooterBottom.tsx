import Image from "next/image";
import React from "react";
import { useTranslation } from "@/lib/i18n";

const FooterBottom = () => {
  const { t } = useTranslation();

  return (
    <>
      <div id="bottom-footer" className="mt-4 py-4 w-full">
        <div className="flex flex-col md:flex-row justify-between w-full px-4">
          <div className="flex flex-col">
            <p className="text-black font-medium">{t("footer.largestMarket")}</p>
            <div className="flex flex-col gap-3 mt-8">
              <p className="text-black font-medium">{t("footer.company")}</p>
              <a href="https://www.autoscout24.com/company/" target="_blank" className="text-black hover:text-blue-950 font-light">
                {t("footer.aboutAutoscout24")}
              </a>
              <a href="https://www.autoscout24.com/company/career/" target="_blank" className="text-black hover:text-blue-950 font-light">
                {t("footer.career")}
              </a>
              <a href="https://www.autoscout24.com/company/contact/" target="_blank" className="text-black hover:text-blue-950 font-light">
                {t("footer.contact")}
              </a>
              <a href="https://www.autoscout24.com/company/imprint/" target="_blank" className="text-black hover:text-blue-950 font-light">
                {t("footer.imprint")}
              </a>
              <a href="https://www.autoscout24.com/company/privacy/" target="_blank" className="text-black hover:text-blue-950 font-light">
                {t("footer.dataProtection")}
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-10">
            <a
              href="https://apps.apple.com/us/app/autoscout24-buy-sell-cars/id311785642?mt=8&pt=229724&ct=web2app"
              target="_blank"
              className="text-black hover:text-blue-950 font-light flex items-center"
            >
              <Image className="mr-2" width={18} height={22} src="./icons/ios-icon.svg" alt="" />
              {t("footer.forIos")}
            </a>
            <a
              href="https://apps.apple.com/us/app/autoscout24-buy-sell-cars/id311785642?mt=8&pt=229724&ct=web2app"
              target="_blank"
              className="text-black hover:text-blue-950 font-light flex items-center"
            >
              <Image className="mr-2" width={18} height={22} src="./icons/android-icon.svg" alt="" />
              {t("footer.forAndroid")}
            </a>
          </div>
        </div>
      </div>
      <div id="copyright" className="flex flex-col items-center md:items-start mt-4 py-4 border-t border-gray-300 px-4">
        <p className="text-gray-500 text-xs font-light">{t("footer.copyright", { year: String(new Date().getFullYear()) })}</p>
      </div>
    </>
  );
};

export default FooterBottom;
