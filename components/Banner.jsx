import Image from "next/image";
import React from "react";

const Banner = ({ bannerText, parentStyles, childStyles, image }) => {
  return (
    <div
      className={`relative w-full flex items-center z-0 overflow-hidden nft-gradient ${parentStyles}`}>
      {image && (
        <Image src="/profile_bg.jpg" alt="profile background" layout="fill" className="h-80 w-full" />
      )}
      <p
        className={`font-bold text-5xl font-poppins leading-70 ${childStyles}`}>
        {bannerText}
      </p>
      <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full bg-white/20 -top-9 -left-16 -z-5" />
      <div className="absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full bg-white/20 -bottom-24 -right-14 -z-5" />
    </div>
  );
};

export default Banner;
