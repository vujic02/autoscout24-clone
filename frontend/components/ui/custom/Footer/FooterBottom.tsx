import Image from "next/image";
import React from "react";

const FooterBottom = () => {
  return (
    <>
      <div id="bottom-footer" className="mt-4 py-4 w-full">
        <div className="flex flex-col md:flex-row justify-between w-full px-4">
          <div className="flex flex-col">
            <p className="text-black font-medium">AutoScout24: the largest pan-European online car market.</p>
            <div className="flex flex-col gap-3 mt-8">
              <p className="text-black font-medium">Company</p>
              <a href="https://www.autoscout24.com/company/" target="_blank" className="text-black hover:text-blue-950 font-light">
                About Autoscout24
              </a>
              <a href="https://www.autoscout24.com/company/career/" target="_blank" className="text-black hover:text-blue-950 font-light">
                Career
              </a>
              <a href="https://www.autoscout24.com/company/contact/" target="_blank" className="text-black hover:text-blue-950 font-light">
                Contact
              </a>
              <a href="https://www.autoscout24.com/company/imprint/" target="_blank" className="text-black hover:text-blue-950 font-light">
                Imprint
              </a>
              <a href="https://www.autoscout24.com/company/privacy/" target="_blank" className="text-black hover:text-blue-950 font-light">
                Data Protection Information
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
              Autoscout24 for iOS
            </a>
            <a
              href="https://apps.apple.com/us/app/autoscout24-buy-sell-cars/id311785642?mt=8&pt=229724&ct=web2app"
              target="_blank"
              className="text-black hover:text-blue-950 font-light flex items-center"
            >
              <Image className="mr-2" width={18} height={22} src="./icons/android-icon.svg" alt="" />
              Autoscout24 for Android
            </a>
          </div>
        </div>
      </div>
      <div id="copyright" className="flex flex-col items-center md:items-start mt-4 py-4 border-t border-gray-300 px-4">
        <p className="text-gray-500 text-xs font-light">© Copyright {new Date().getFullYear()} by AutoScout24 GmbH. All Rights reserved.</p>
      </div>
    </>
  );
};

export default FooterBottom;
