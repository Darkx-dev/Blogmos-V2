"use client";
import React, { useState } from "react";
import {
  SidebarProvider,
  DesktopSidebar,
  MobileSidebar,
  SidebarLink,
} from "@/components/ui/sidebar"; // Adjust the import based on the actual library structure
import Image from "next/image";
import { assets } from "@/assets"; // Adjust the path based on your project structure
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Define links
  const links = [
    {
      label: "Add Blogs",
      href: "/admin/addProduct",
      icon: <Image src={assets.add_icon} width={24} alt="Add Blog Icon" />,
    },
    {
      label: "Blog List",
      href: "/admin/blogList",
      icon: <Image src={assets.blog_icon} width={24} alt="Blog List Icon" />,
    },
    {
      label: "Subscribers",
      href: "/admin/subscribers",
      icon: <Image src={assets.email_icon} width={24} alt="Subscribers Icon" />,
    },
  ];

  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      <DesktopSidebar className="shadow-lg min-h-screen h-full">
        <div className="flex items-center pl-2 h-[60px] bg-gray-200">
          <Image src={assets.logo} width={40} alt="Logo" />
          <SidebarLink
            link={{
              href: "/",
              label: "Blogmos v2",
            }}
            className="*:text-xl pl-2 font-semibold"
          />
        </div>
        <div className={`flex-1 flex-grow flex flex-col py-10 *:px-4 bg-gray-200 `}>
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <SidebarLink
                key={index}
                link={link}
                className={`my-1 h-16 *:text-lg ${
                  isActive ? "invert bg-white" : ""
                }`}
              />
            );
          })}
        </div>
      </DesktopSidebar>
      <MobileSidebar className="bg-gray-100 shadow-lg justify-start p-0">
        <div className="flex items-center gap-3 text-2xl px-4 py-4 border-b border-gray-300">
          <Image src={assets.logo} width={50} alt="Logo" />
          <SidebarLink
            link={{
              href: "/",
              label: "Blogmos v2",
            }}
            className="*:text-xl pl-2"
          />
        </div>
        <div className={`flex flex-col px-5 mt-10`} onClick={() => setOpen(!open)}>
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <SidebarLink
                key={index}
                link={link}
                className={`my-1 h-16 *:text-lg px-5 ${
                  isActive ? "invert bg-white" : ""
                }`}
              />
            );
          })}
        </div>
      </MobileSidebar>
    </SidebarProvider>
  );
};

export default Sidebar;
