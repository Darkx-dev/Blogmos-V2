'use client'

import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import NavBar from "./NavBar"
import { motion } from "framer-motion"

export default function Header() {
  const [email, setEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/email", { email })
      if (response.data.success) {
        setDialogMessage("Subscription successful!")
      } else {
        setDialogMessage("Error: Subscription failed.")
      }
    } catch (error) {
      setDialogMessage("Seems like you already have a subscription")
    } finally {
      setIsDialogOpen(true)
      setEmail("")
    }
  }

  return (
    <header className=" px-5 py-8 md:px-12 lg:px-28 relative">
      <NavBar />
      <motion.div 
        className="my-10 text-center pt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold sm:text-8xl mb-4">
          BLOGS
        </h1>
        <p className="mx-auto mt-4 max-w-[740px] text-sm text-gray-400 sm:text-base">
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
            className="w-full sm:py-5 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            required
          />
          <Button type="submit" className="rounded-l-none sm:py-5  hover:bg-gray-200">
            Subscribe
          </Button>
        </form>
      </motion.div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Open</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-800 text-white">
          <AlertDialogTitle>Notification</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">{dialogMessage}</AlertDialogDescription>
          <div className="flex justify-end gap-4 mt-4">
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)} className="bg-gray-700 text-white hover:bg-gray-600">
              Close
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}