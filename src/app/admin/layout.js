"use client";
import SidebarAdmin from "@/components/AdminComponents/Sidebar";
import UserDropdown from "@/components/AdminComponents/UserDropdown";
import ThemeToggle from "@/components/ThemeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  if (!session) return null;
  if (session && !session?.user?.isAdmin) notFound();
  else if (session && !session?.user?.isAdmin)
    return <h1>YOU ARE NOT ADMIN</h1>;
  else
    return (
      <div className="flex min-h-screen">
        <ToastContainer theme="light" />
        <div className="flex max-md:hidden">
          <SidebarAdmin />
        </div>
        <ScrollArea className="flex flex-col w-full pb-5 overscroll-y-auto max-h-screen">
          <div className="flex justify-between px-4 md:px-8 items-center py-3 w-full max-h-[60px] border-b border-black">
            <h5 className="font-medium"></h5>
            <div className="flex items-center gap-2">
              <UserDropdown />
              <ThemeToggle/>
              <div className="hidden max-md:flex">
                <SidebarAdmin />
              </div>
            </div>
          </div>
          {children}
        </ScrollArea>
      </div>
    );
};

export default Layout;
