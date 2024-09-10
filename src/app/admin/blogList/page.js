"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchBlogs = async (page = 1, query = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/blog?page=${page}&limit=10&query=${query}`);
      setBlogs(response.data.blogs);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs(1, debouncedQuery); // Fetch with the debounced query
  }, [debouncedQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBlogs(newPage, debouncedQuery);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/api/blog?id=${blogId}`);
      fetchBlogs(currentPage, debouncedQuery);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">All Blogs</h2>
        <Input
          placeholder="Search for blogs"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          name="query"
          className="w-full sm:py-5 max-w-[400px] rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Author</TableHead>
              <TableHead>Blog Title</TableHead>
              <TableHead className="hidden sm:block">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={blog.author?.profileImg} alt={blog.author?.name} />
                      <AvatarFallback>{blog.author?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-nowrap">{blog.author?.name}</span>
                  </div>
                </TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell className="hidden sm:block">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleDelete(blog._id)}>
                        <p className="hover:text-red-500 w-full h-full">Delete</p>
                      </DropdownMenuItem>
                      {/* Add more actions as needed */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BlogList;
