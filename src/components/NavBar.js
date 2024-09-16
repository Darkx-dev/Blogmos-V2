"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import UserDropdown from "./AdminComponents/UserDropdown"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false })

const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState("up")

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDir = () => {
      const scrollY = window.scrollY
      setScrollDir(scrollY > lastScrollY ? "down" : "up")
      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    window.addEventListener("scroll", updateScrollDir)
    return () => window.removeEventListener("scroll", updateScrollDir)
  }, [])

  return scrollDir
}

const NavBar = ({ className }) => {
  const { data: session } = useSession()
  const scrollDirection = useScrollDirection()

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === "down" ? -80 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-background shadow-sm",
        className
      )}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[3px] text-base font-semibold sm:text-2xl">
            <Image
              src="/images/logo.png"
              width={30}
              height={30}
              alt="Logo"
              className="w-[25px] sm:w-[30px] dark:invert dark:contrast-200 dark:brightness-125"
            />
            <span>logmos</span>
          </Link>

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Research Areas</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] list-none">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/research"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">Research Overview</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explore Dr. Smith&apos;s groundbreaking research in biotechnology.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/research/genetic-engineering" title="Genetic Engineering">
                        CRISPR and advanced gene editing techniques
                      </ListItem>
                      <ListItem href="/research/synthetic-biology" title="Synthetic Biology">
                        Designing new biological parts and systems
                      </ListItem>
                      <ListItem href="/research/bioinformatics" title="Bioinformatics">
                        Computational approaches in biotechnology
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/publications" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Publications
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/blogs" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session?.user?.isAdmin && <UserDropdown />}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="backdrop-blur-md bg-transparent">
                <SheetHeader>
                  <SheetTitle>Blogmos</SheetTitle>
                  <SheetDescription>Navigate our research website</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-4">
                    <Link href="/research" className="text-sm font-medium hover:underline">
                      Research Areas
                    </Link>
                    <Link href="/publications" className="text-sm font-medium hover:underline">
                      Publications
                    </Link>
                    <Link href="/blogs" className="text-sm font-medium hover:underline">
                      Blog
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:underline">
                      Contact
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default NavBar