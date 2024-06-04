import React from "react";

const Pulse = () => {
  return (
    <span className="relative inline-flex w-[10px] h-[10px] justify-center items-center">
      <span className="absolute inline-flex w-full h-full bg-green-800 rounded-full animate-ping opacity-70" />
      <span className="relative inline-flex rounded-full w-[8px] h-[8px] bg-green-900" />
    </span>
  );
};

export default Pulse;
