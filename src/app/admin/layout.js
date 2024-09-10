"use client";
import SidebarAdmin from "@/components/AdminComponents/Sidebar";
import UserDropdown from "@/components/AdminComponents/UserDropdown";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  if (!session) return <h1>NOT AUTHORIZED</h1>;
  else if (session && !session?.user?.isAdmin)
    return <h1>ASK OWNER FOR ASSISTANCE</h1>;
  else
    return (
      <div className="flex min-h-screen">
        <ToastContainer theme="light" />
        <div className="flex max-md:hidden">
          <SidebarAdmin />
        </div>
        <div className="flex flex-col w-full pb-5">
          <div className="flex justify-between px-4 md:px-8 items-center py-3 w-full max-h-[60px] border-b border-black">
            <h5 className="font-medium"></h5>
            <div className="flex items-center">
              <UserDropdown />
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
