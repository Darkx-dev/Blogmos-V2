"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import NavBar from "./NavBar";


export default function Header() {
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
    <header className="bg-gray-200 dark:bg-background px-5 py-8 md:px-12 lg:px-28 relative">
      <NavBar />
      <div className="my-10 text-center pt-10">
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
