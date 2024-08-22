import { ArrowUpToLine } from "lucide-react";
import React from "react";

const FooterMid = () => {
  return (
    <div id="mid-footer" className="mt-8 border-t border-b border-gray-300 py-4 w-full flex justify-end px-4">
      <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-blue-600 flex items-center font-light" href="">
        To the top
        <ArrowUpToLine className="ml-1" />
      </a>
    </div>
  );
};

export default FooterMid;
