"use client";
import Image from "next/image";
import React, { useState } from "react";
import { assets } from "@/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const [email, setEmail] = useState("");
  const { data: session } = useSession();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await axios.post("/api/email", formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <header className="py-8 px-5 md:px-12 lg:px-28 bg-gray-200 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 sm:gap-3 text-base sm:text-2xl font-semibold">
          <Image
            src={assets.logo}
            width={180}
            alt="Logo"
            className="w-[25px] sm:w-auto"
          />
          <a href="/">Blogmos v2</a>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.isAdmin ? (
            <Link
              href="admin"
              className="font-medium py-2 px-4 sm:py-3 sm:px-6 bg-black text-white rounded shadow hover:bg-gray-800 transition duration-300"
            >
              Welcome admin
            </Link>
          ) : (
            <button className="flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-black text-white rounded shadow hover:bg-gray-800 transition duration-300">
              Get Started <Image src={assets.arrow} alt="Arrow" />
            </button>
          )}
        </div>
      </div>
      <div className="text-center my-10">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-800">
          Latest Blogs
        </h1>
        <p className="mt-4 max-w-[740px] mx-auto text-sm sm:text-base text-gray-600">
          Discover the latest insights and trends in our blog. Join our
          community and stay updated!
        </p>
        <form
          className="mt-8 flex flex-row justify-center items-center max-w-[500px] mx-auto"
          onSubmit={onSubmitHandler}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="flex-1 p-2 sm:py-4 outline-none border-none w-full"
          />
          <button
            type="submit"
            className="bg-black text-white py-2 sm:py-4 px-6 sm:px-8 transition duration-300 hover:bg-gray-800"
          >
            Subscribe
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
