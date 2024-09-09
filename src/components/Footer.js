import { assets } from "@/assets";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-between px-4 flex-col gap-2 mt-auto sm:gap-0 sm:flex-row bg-black py-5 items-center">
      <div className="flex text-white items-center gap-3">
        <Image src={assets.logo_light} alt="" width={40} />
        <a href="/">Blogmos v2</a>
      </div>
      <p className="text-sm text-white">
        All right reserved. Copyright @blogmos v2
      </p>
      <div className="flex">
        <Image src={assets.facebook_icon} alt="" width={40} />
        <Image src={assets.twitter_icon} alt="" width={40} />
        <Image src={assets.googleplus_icon} alt="" width={40} />
      </div>
    </div>
  );
};

export default Footer;
