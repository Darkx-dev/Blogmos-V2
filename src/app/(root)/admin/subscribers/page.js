"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const { toast } = useToast();

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
        toast({
          title: "Success",
          description: "Subscribers fetched successfully.",
        });
      } else {
        throw new Error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setError("Failed to get Subscribers. Please try again later.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch subscribers. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, toast]);

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
      setSubscribers(
        subscribers.filter((subscriber) => subscriber._id !== emailId)
      );
      toast({
        title: "Success",
        description: "Subscriber deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subscriber. Please try again.",
      });
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const renderContent = () => {
    if (isLoading) {
      return <SubscribersSkeleton />;
    }

    if (error) {
      return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (subscribers.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-lg font-semibold mb-2">No subscribers found</p>
          <p className="text-gray-500">
            Try adjusting your search or add new subscribers.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-md border overflow-hidden ">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Email Address</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow
                key={subscriber._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{subscriber.email}</TableCell>
                <TableCell className="hidden sm:table-cell">
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
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="flex-1 min-h-[calc(100vh-80px)]">
      <CardContent>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl ">All Subscribers</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search for subscribers"
              value={searchQuery}
              onChange={handleSearch}
              type="text"
              name="query"
              className="pl-8 w-full sm:w-[300px] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
              aria-label="Search subscribers"
            />
          </div>
        </div>
        {renderContent()}
        {subscribers.length > 0 && (
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
};

const SubscribersSkeleton = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Email Address</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 md:w-1/2" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-5 w-24" />
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
};

export default Subscribers;
