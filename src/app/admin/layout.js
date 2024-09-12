"use client"

import React from "react"
import { useSession } from "next-auth/react"
import { notFound } from "next/navigation"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SidebarAdmin from "@/components/AdminComponents/Sidebar"
import UserDropdown from "@/components/AdminComponents/UserDropdown"
import ThemeToggle from "@/components/ThemeToggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Layout({ children }) {
  const { data: session } = useSession()

  if (!session) return null
  if (session && !session?.user?.isAdmin) notFound()

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <SidebarAdmin />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Header */}
        <header className="flex justify-between items-center px-4 h-16 border-b">
          <h1 className="text-2xl font-semibold dark:text-white">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <UserDropdown />
            <ThemeToggle />
            
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarAdmin />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-8">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}