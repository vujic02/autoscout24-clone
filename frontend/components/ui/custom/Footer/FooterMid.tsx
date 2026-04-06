import { ArrowUpToLine } from "lucide-react";
import React from "react";
import { useTranslation } from "@/lib/i18n";

const FooterMid = () => {
  const { t } = useTranslation();

  return (
    <div id="mid-footer" className="mt-8 border-t border-b border-gray-300 py-4 w-full flex justify-end px-4">
      <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-blue-600 flex items-center font-light" href="">
        {t("footer.toTheTop")}
        <ArrowUpToLine className="ml-1" />
      </a>
    </div>
  );
};

export default FooterMid;
