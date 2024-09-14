"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, ListOrdered, Users, Home } from "lucide-react"
import Image from "next/image"

const links = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Add Blog", href: "/admin/addProduct", icon: PlusCircle },
  { label: "Blog List", href: "/admin/blogList", icon: ListOrdered },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
]

const SidebarLink = ({ href, label, icon: Icon, isActive }) => (
  <Link href={href} passHref>
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2 px-2",
        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  </Link>
)

export default function Sidebar({ className }) {
  const pathname = usePathname()

  return (
    <aside className={cn("w-64 bg-background border-r", className)}>
      <div className="flex h-16 items-center border-b px-6 gap-2">
        <Image src="/images/logo.png" width={25} height={25} alt="logo" className="dark:invert"/>
        <Link href="/">
        <p className="text-lg font-semibold dark:text-white">Blogmos v2</p>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
        <nav className="flex flex-col gap-2 p-4">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              {...link}
              isActive={pathname === link.href}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}