"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
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
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/blog", {
        params: {
          page: currentPage,
          limit: 10,
          query: debouncedSearchQuery,
        },
      });
      setBlogs(response.data.docs);
      setTotalPages(response.data.totalPages || 1);
      toast({
        title: "Success",
        description: "Blogs fetched successfully.",
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to fetch blogs. Please try again later.");
      setBlogs([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch blogs. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/api/blog?id=${blogId}`);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      toast({
        title: "Success",
        description: "Blog deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog. Please try again.",
      });
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const memoizedTableBody = useMemo(
    () => (
      <TableBody>
        {blogs.map((blog) => (
          <TableRow
            key={blog._id}
            className=" transition-colors"
          >
            <TableCell className="font-medium">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={blog.author?.profileImg}
                    alt={blog.author?.name}
                  />
                  <AvatarFallback>
                    {blog.author?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-nowrap">
                  {blog.author?.name || "Unknown"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Link
                href={`/blogs/${blog._id}`}
                className=" hover:underline"
              >
                {blog.title}
              </Link>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {blog.createdAt
                ? format(new Date(blog.createdAt), "MMM dd, yyyy")
                : "N/A"}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Separator />
                  <DropdownMenuItem>
                    <Link
                      href={`/admin/blog/edit/${blog._id}`}
                      className="w-full h-full"
                    >
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(blog._id)}>
                    <p className="text-red-500 w-full h-full cursor-pointer">
                      Delete
                    </p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    ),
    [blogs]
  );

  const renderContent = () => {
    if (isLoading) {
      return <BlogListSkeleton />;
    }

    if (error) {
      return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (blogs.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-lg font-semibold mb-2">No blogs found</p>
          <p className="text-gray-500">
            Try adjusting your search or add a new blog post.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Author</TableHead>
              <TableHead>Blog Title</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {memoizedTableBody}
        </Table>
      </div>
    );
  };

  return (
    <Card className="flex-1 min-h-[calc(100vh-80px)]">
      <CardContent>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">All Blogs</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search for blogs"
              value={searchQuery}
              onChange={handleSearch}
              type="text"
              name="query"
              className="pl-8 w-full sm:w-[300px] focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Search blogs"
            />
          </div>
        </div>
        {renderContent()}
        {blogs.length > 0 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BlogListSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Author</TableHead>
            <TableHead>Blog Title</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Skeleton className="min-h-8 min-w-8 rounded-full" />
                  <Skeleton className="h-3 w-full " />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-3" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-3" />
              </TableCell>
              <TableCell className="text-right">
                <MoreHorizontal className="size-4 ml-auto mr-2" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
