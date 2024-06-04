import React from "react";

type PropTypes = {
  text: string;
};

const CustomMarquee = ({ text }: PropTypes) => {
  return (
    <div className="w-full overflow-hidden font-bold">
      <p className="w-full animate-marquee3">{text}</p>
    </div>
  );
};

export default CustomMarquee;
