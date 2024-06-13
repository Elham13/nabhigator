import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-2 bg-white shadow-[0_5px_10px_-5px_gray]">
      <div className="flex pad:h-14 desk:h-20">
        <Image
          src="/images/nabhigator.jpeg"
          alt="Nabhigator Logo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "7rem", height: "auto" }}
          priority
          unoptimized
        />
      </div>
      <div className="flex pad:h-14 desk:h-20">
        <Image
          src="/svgs/nivabupaLogo.svg"
          alt="Nivabupa Logo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "6rem", height: "auto" }}
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default Header;
