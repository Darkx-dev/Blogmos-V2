"use client";

import React from "react";
import Image from "next/image";
import { IconBrandFacebook, IconBrandGoogle, IconX } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-black py-2 sm:py-6 mt-auto px-4">
      <div className="container mx-auto px-5 flex flex-col gap-4 items-center sm:flex-row justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-[3px] text-white">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
          <a href="/" className="text-white text-lg font-semibold">
            logmos v2
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-400">
          All rights reserved. &copy; {new Date().getFullYear()} Blogmos v2
        </p>

        {/* Social Icons */}
        {/*<div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandFacebook size={25} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconX size={25}/>
          </a>
          <a
            href="https://plus.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGoogle size={25}/>
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
