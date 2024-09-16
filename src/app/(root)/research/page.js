"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { UserIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col justify-center">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 bg-opacity-50 rounded-full px-4 py-2 inline-block"
          >
            <p className="text-sm">Dr. Smith Lab is a ChatGPT-powered research assistant</p>
          </motion.div>
        </header>

        <main className="flex flex-col lg:flex-row items-center justify-between ">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 mb-8 lg:mb-0"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Make Your <span className="">Research</span> More Productive
            </h1>
            <p className="text-xl mb-6 text-gray-400">
              Dr. Smith Lab is an AI-powered research assistant that transforms your ideas into publications, experiments, and breakthroughs in seconds.
            </p>
            <Button className="px-8 py-3 rounded-full text-lg font-semibold">
              Get Started
            </Button>
          </motion.div>
        </main>

        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <p className="text-center text-gray-500 mb-4">Our Research Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Partner1', 'Partner2', 'Partner3', 'Partner4', 'Partner5', 'Partner6'].map((partner, index) => (
              <div key={index} className="">
                <div className="border-2 size-12 rounded-full p-5"/>
              </div>
            ))}
          </div>
        </motion.footer>
      </div>
    </div>
  )
}