"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react";
import BlogItem from "./BlogItem";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 6;

  // Fetch blogs with pagination and search query
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/blog", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          query: searchQuery,
          category: menu !== "All" ? menu : undefined,
        },
      });
      setBlogs(response.data.docs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, menu]);

  // Fetch blogs when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500); // 300ms debounce

    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setMenu(category);
    setCurrentPage(1);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const categories = useMemo(() => ["All", "Technology", "Startup", "Lifestyle"], []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Menu Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              {menu}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Search for blogs"
          value={searchQuery}
          onChange={handleSearchChange}
          type="text"
          name="query"
          className="sm:py-5 sm:max-w-[400px] w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          required
        />
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 min-h-[50vh]">
        {loading ? (
          Array(ITEMS_PER_PAGE)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="w-full h-[300px]" />
            ))
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
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
          ))
        ) : (
          <p className="col-span-full text-center text-lg">No blogs found.</p>
        )}
      </div>

      {/* Pagination */}
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
  );
};

export default BlogList;