import Image from "next/image";
import React, { useState, useEffect } from "react";
import UserDropdown from "./AdminComponents/UserDropdown";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

// Custom hook to detect scroll direction
const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const scrollY = window.scrollY;
      setScrollDir(scrollY > lastScrollY ? "down" : "up");
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []);

  return scrollDir;
};

const NavBar = ({ className }) => {
  const { data: session } = useSession();
  const scrollDirection = useScrollDirection();

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === "down" ? -80 : 0 }}
      transition={{ duration: 0.5, ease: "circInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-[3px] text-base font-semibold sm:text-2xl"
          >
            <Image
              src="/images/logo.png"
              width={30}
              height={30}
              alt="Logo"
              className="w-[25px] sm:w-[30px] dark:invert dark:contrast-200 dark:brightness-125"
            />
            <span>logmos v2</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session?.user?.isAdmin && <UserDropdown />}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
