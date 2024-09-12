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
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { date } from "zod";

const UserDropdown = () => {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <p className="pr-2 hidden sm:block">{session?.user?.name}</p>
        <Avatar>
          <AvatarImage src={session?.user?.image} />
          <AvatarFallback>{session?.user?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="translate-y-3">
        <DropdownMenuLabel>
          <p className="sm:hidden">{session?.user?.name}</p>
          <p>{session?.user?.email}</p>
        </DropdownMenuLabel>
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
