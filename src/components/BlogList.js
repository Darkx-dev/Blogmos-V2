"use client"

import React, { useEffect, useState, useCallback } from "react"
import BlogItem from "./BlogItem"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

const ITEMS_PER_PAGE = 9
const categories = ["All", "Technology", "Startup", "Lifestyle"]

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/blog", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          query: searchQuery,
          category: activeCategory !== "All" ? activeCategory : undefined,
        },
      })
      setBlogs(response.data.docs)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, activeCategory])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchBlogs])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto px-4 sm:max-w-7xl py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-primary">Our Blogs</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <AnimatePresence>
            {isSearchVisible && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full max-w-xs"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => handleCategoryChange(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mb-12 min-h-[60vh]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(ITEMS_PER_PAGE)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="w-full h-[400px] rounded-lg" />
              ))}
          </div>
        ) : blogs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {blogs.map((blog) => (
              <BlogItem
                key={blog._id}
                id={blog._id}
                title={blog.title}
                description={blog.description}
                image={blog.image}
                category={blog.category}
                createdAt={formatDate(blog.createdAt)}
                updatedAt={formatDate(blog.updatedAt)}
              />
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-lg text-muted-foreground">No blogs found.</p>
        )}
      </div>

      {!loading && blogs.length > 0 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}