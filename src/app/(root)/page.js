"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, BookOpen, MessageCircle } from "lucide-react";
import axios from "axios";
import BlogItem from "@/components/BlogItem";
import NavBar from "@/components/NavBar";

const ITEMS_PER_PAGE = 6;

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get("/api/blog", {
        params: {
          page: 1,
          limit: ITEMS_PER_PAGE,
        },
      });
      setBlogPosts(response.data.docs);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchBlogPosts, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <HeroSection />
        {/* <FeaturedSection /> */}
        <BlogPostsSection blogPosts={blogPosts} isLoading={isLoading} />
      </main>
    </div>
  );
};

const HeroSection = () => (
  <section className="text-center py-20">
    <motion.h1
      className="text-4xl md:text-6xl font-bold mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Blogmos
    </motion.h1>
    <motion.p
      className="text-xl mb-8 text-gray-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Explore the Cosmos of Ideas
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Button asChild size="lg">
        <Link href="/blogs">
          Start Exploring <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </motion.div>
  </section>
);

const FeaturedSection = () => (
  <section className="my-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Blogmos?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        title="Trending Topics"
        description="Stay informed with our curated selection of the most relevant and talked-about subjects."
        icon={<TrendingUp className="h-6 w-6" />}
      />
      <FeatureCard
        title="In-Depth Articles"
        description="Dive deep into comprehensive analyses and thought-provoking content from expert writers."
        icon={<BookOpen className="h-6 w-6" />}
      />
      <FeatureCard
        title="Engaged Community"
        description="Join discussions, share insights, and connect with like-minded readers in our vibrant community."
        icon={<MessageCircle className="h-6 w-6" />}
      />
    </div>
  </section>
);

const FeatureCard = ({ title, description, icon }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="">{description}</p>
    </CardContent>
  </Card>
);

const BlogPostsSection = ({ blogPosts, isLoading }) => (
  <section className="my-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>
    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlogItem {...post} />
          </motion.div>
        ))}
      </div>
    )}
    <div className="mt-12 text-center">
      <Button asChild>
        <Link href="/blogs">
          View All Posts <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </section>
);

export default HomePage;
