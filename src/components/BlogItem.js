"use client"

import React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function BlogItem({ id, title, category, description, image, createdAt, updatedAt }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="relative overflow-hidden h-[350px] group">
        <Image
          priority
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 group-hover:to-black/70 transition-all duration-300" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <CardContent className="relative z-10 transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {category}
            </span>
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-200 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description}
            </p>
            <div className="flex items-center text-xs text-gray-300 space-x-4 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="relative z-10 p-0">
            <Link href={`/blogs/${id}`} className="w-full">
              <Button variant="secondary" className="w-full group">
                Read more
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}