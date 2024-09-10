'use client';

import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets';

const Footer = () => {
  return (
    <footer className="bg-black py-6 mt-auto px-4">
      <div className="container mx-auto flex flex-col gap-4 items-center sm:flex-row justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 text-white">
          <Image src={assets.logo_light} alt="Logo" width={40} height={40} />
          <a href="/" className="text-white text-lg font-semibold">Blogmos v2</a>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-400">
          All rights reserved. &copy; {new Date().getFullYear()} Blogmos v2
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Image src={assets.facebook_icon} alt="Facebook" width={24} height={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Image src={assets.twitter_icon} alt="Twitter" width={24} height={24} />
          </a>
          <a href="https://plus.google.com" target="_blank" rel="noopener noreferrer">
            <Image src={assets.googleplus_icon} alt="Google Plus" width={24} height={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
