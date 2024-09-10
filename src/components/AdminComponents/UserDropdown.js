"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserDropdown = () => {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <p className="pr-2">{session?.user?.name}</p>
        <Image
          src={session?.user?.image}
          alt=""
          width={25}
          height={25}
          className="w-auto rounded-full cursor-pointer hover:border-black hover:scale-[1.1] transition-all border-1 border-transparent"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/admin/blogList">Admin Panel</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="/api/auth/signout"
              className="hover:text-red-500 w-full h-full"
            >
              Logout
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
