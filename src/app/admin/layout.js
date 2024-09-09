"use client"
import { assets } from "@/assets";
import SidebarAdmin from "@/components/AdminComponents/Sidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <ToastContainer theme="light" />
      <div className="flex max-md:hidden">
        <SidebarAdmin />
      </div>
      <div className="flex flex-col w-full pb-5">
        <div className="flex justify-between px-4 md:px-8 items-center py-3 w-full max-h-[60px] border-b border-black">
          <h5 className="font-medium">
          </h5>
          <div className="flex items-center">
            <Link href="/admin/profile">
              <Image src={"/author_img.png"} alt="" width={40} height={40}/>
            </Link>
            <div className="hidden max-md:flex">
              <SidebarAdmin />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
