import React, { useEffect, useState, useMemo } from "react";
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
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const ITEMS_PER_PAGE = 6;

  // Fetch blogs with pagination and search query
  const fetchBlogs = async (page, query = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/blog?page=${page}&limit=${ITEMS_PER_PAGE}&query=${query}`
      );
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // Update debounced query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch blogs when debounced query changes
  useEffect(() => {
    fetchBlogs(1, debouncedQuery);
  }, [debouncedQuery]);

  // Filter blogs based on the selected category
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      menu === "All" ? true : blog.category === menu
    );
  }, [blogs, menu]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBlogs(newPage, debouncedQuery);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Menu Section */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {menu}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              {["All", "Technology", "Startup", "Lifestyle"].map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => {
                    setMenu(category);
                    fetchBlogs(1, debouncedQuery);
                  }}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input
          placeholder="Search for blogs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
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
      {!loading && filteredBlogs.length > 0 && (
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
