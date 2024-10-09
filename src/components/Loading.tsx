import React from "react";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

const Loading = ({ size = 18 }: { size?: number }) => {
  return (
    <div className="flex justify-center items-center">
      <HiOutlineCog6Tooth
        className="animate-spin-slow text-slate-400"
        size={size}
      />
    </div>
  );
};

export default Loading;
