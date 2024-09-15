"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await fetch("/api/dashboard/stats");
      const statsData = await statsResponse.json();
      setStats(statsData);

      const postsResponse = await fetch("/api/blog?page=1&limit=4");
      const postsData = await postsResponse.json();
      setRecentPosts(postsData.docs);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={stats?.totalPosts}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Views"
          value={stats?.totalViews}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Subscribers"
          value={stats?.subscribers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="New Posts"
          value={stats?.newPosts}
          icon={<PlusCircle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="">Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-11 w-11 rounded-full" />
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[160px]" />
                        </div>
                      </div>
                    ))
                : recentPosts?.map((post) => (
                    <div key={post._id} className="flex items-center">
                      <Avatar>
                        <AvatarImage src={post.author.profileImg} />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1 w-full">
                        <Link
                          href={`/blogs/${post._id}`}
                          className="text-sm font-medium leading-none block" 
                        >
                          {post.title}
                        </Link>
                        <p className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span>{post.views} views</span>
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="space-y-2">
                <Label htmlFor="new-post-title">New Post Title</Label>
                <Input
                  id="new-post-title"
                  placeholder="Enter post title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <Link href={`/admin/addProduct?title=${newPostTitle}`}>
                <Button className="w-full mt-2">
                  Create New Post
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Link href="/admin/subscribers" passHref>
              <Button variant="outline" className="w-full mt-4">
                View All Subscribers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, isLoading }) {
  return (
    <Card className="border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}
