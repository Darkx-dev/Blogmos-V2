"use client";

import Image from "next/image";
import React, { useState } from "react";
import { assets } from "@/assets";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserDropdown from "./AdminComponents/UserDropdown";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import ThemeToggle from "./ThemeToggle.js"

export default function Header() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/email", { email });
      if (response.data.success) {
        setDialogMessage("Subscription successful!");
      } else {
        setDialogMessage("Error: Subscription failed.");
      }
    } catch (error) {
      setDialogMessage("Seems like you are already have a subscription");
    } finally {
      setIsDialogOpen(true);
      setEmail("");
    }
  };

  return (
    <header className="bg-gray-200 dark:bg-transparent px-5 py-8 md:px-12 lg:px-28">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-base font-semibold sm:gap-3 sm:text-2xl">
          <Image
            src={assets.logo}
            width={30}
            height={30}
            alt="Logo"
            className="w-[25px] sm:w-[40px] dark:invert"
          />
          <Link href="/">Blogmos v2</Link>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.isAdmin && <UserDropdown />}
            <ThemeToggle/>
          {/* {session?.user?.isAdmin ? (
            <Button asChild variant="default" className="py-6">
              <Link href="/admin">Welcome admin</Link>
            </Button>
          ) : (
            <Button variant="default" className="py-6">
              Get Started{" "}
              <Image
                src={assets.arrow}
                alt="Arrow"
                width={16}
                height={16}
                className="ml-2"
              />
            </Button>
          )} */}
        </div>
      </div>
      <div className="my-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white sm:text-6xl">
          Latest Blogs
        </h1>
        <p className="mx-auto mt-4 max-w-[740px] text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Discover the latest insights and trends in our blog. Join our
          community and stay updated!
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-[500px] flex-row items-center justify-center"
        >
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full sm:py-5 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
            required
          />
          <Button type="submit" className="rounded-l-none sm:py-5">
            Subscribe
          </Button>
        </form>
      </div>

      {/* Alert Dialog for notifications */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          {/* This trigger is hidden but required */}
          <Button className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Notification</AlertDialogTitle>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          <div className="flex justify-end gap-4 mt-4">
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Close
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
