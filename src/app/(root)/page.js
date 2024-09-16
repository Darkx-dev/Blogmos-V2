"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import BlogItem from "@/components/BlogItem";

const ITEMS_PER_PAGE = 3;

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get("/api/blog", {
          params: {
            page: 1,
            limit: ITEMS_PER_PAGE,
          },
        });
        setBlogPosts(response.data.docs);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <HeroSection />
        <BlogPostsSection blogPosts={blogPosts} isLoading={isLoading} />
      </main>
    </div>
  );
};

const HeroSection = () => (
  <section className="text-center py-20">
    <motion.h1
      className="text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Dr. Jane Smith
    </motion.h1>
    <motion.p
      className="text-xl mb-8 text-gray-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Advancing Biotechnology for a Sustainable Future
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Button asChild size="lg">
        <Link href="/research">
          Explore My Research <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </motion.div>
  </section>
);

const ResearchHighlights = () => (
  <section className="my-16">
    <h2 className="text-3xl font-bold mb-8 text-center">
      Research Highlights
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ResearchCard
        title="CRISPR Gene Editing"
        description="Developing novel CRISPR applications for treating genetic disorders and enhancing crop resilience."
      />
      <ResearchCard
        title="Synthetic Biology"
        description="Engineering biological systems for sustainable biofuel production and environmental remediation."
      />
      <ResearchCard
        title="AI in Bioinformatics"
        description="Leveraging machine learning for genomic data analysis and drug discovery acceleration."
      />
    </div>
  </section>
);

const ResearchCard = ({ title, description }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const LatestPublications = () => (
  <section className="my-16">
    <h2 className="text-3xl font-bold mb-8 text-center">
      Latest Publications
    </h2>
    <div className="space-y-4">
      <PublicationItem
        title="Breakthrough in CRISPR-based Gene Therapy for Rare Genetic Disorders"
        journal="Nature Biotechnology"
        date="August 2023"
        link="https://example.com/publication1"
      />
      <PublicationItem
        title="Synthetic Biology Approaches to Sustainable Biofuel Production"
        journal="Science"
        date="July 2023"
        link="https://example.com/publication2"
      />
      <PublicationItem
        title="Machine Learning Models for Predicting Protein-Drug Interactions"
        journal="Bioinformatics"
        date="June 2023"
        link="https://example.com/publication3"
      />
    </div>
    <div className="mt-8 text-center">
      <Button asChild variant="outline">
        <Link href="/publications">
          View All Publications <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </section>
);

const PublicationItem = ({ title, journal, date, link }) => (
  <div className=" p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
    <h3 className="font-semibold text-lg mb-2 ">{title}</h3>
    <p className="text-sm text-gray-600 mb-2">
      {journal} - {date}
    </p>
    <div className="flex justify-between items-center">
      <Badge variant="secondary">{journal}</Badge>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className=" hover:underline flex items-center"
      >
        Read Paper <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    </div>
  </div>
);

const BlogPostsSection = ({ blogPosts, isLoading }) => (
  <section className="my-16">
    <h2 className="text-3xl font-bold mb-8 text-center">
      Latest Blog Posts
    </h2>
    {isLoading ? (
      <p className="text-center text-gray-600">Loading blog posts...</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts.map((post) => (
        <BlogItem key={post._id} {...post} />
      ))}
      </div>
    )}
    <div className="mt-8 text-center">
      <Button asChild>
        <Link href="/blogs">
          Read More on the Blog <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </section>
);

export default HomePage;
