"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/email`, {
        params: {
          page: currentPage,
          limit: 10,
          query: searchQuery,
        },
      });
      if (response.data && Array.isArray(response.data.docs)) {
        setSubscribers(response.data.docs);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to get Subscribers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscribers();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchSubscribers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (emailId) => {
    try {
      await axios.delete(`/api/email?id=${emailId}`);
      subscribers.filter((subscriber) => subscriber._id!== emailId);
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      setError("Failed to delete subscriber, try again");
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-bold dark:text-white">All Subscribers</h2>
        <Input
          placeholder="Search for subscribers"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          name="query"
          className="w-full sm:py-5 max-w-[400px] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
        />
      </div>
      <div className="rounded-md">
        {isLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : subscribers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers &&
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber._id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell className="hidden sm:block">
                      {format(new Date(subscriber.createdAt), "MMM dd, yyyy")}
                    </TableCell>
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
                          <DropdownMenuItem
                            onClick={() => handleDelete(subscriber._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                          {/* Add more actions as needed */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4">No Subscribers found.</div>
        )}
      </div>
      {subscribers.length > 0 && (
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
      )}
    </div>
  );
};

export default Subscribers;
