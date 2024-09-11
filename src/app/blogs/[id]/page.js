"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assets } from "@/assets";
import Footer from "@/components/Footer";
import "highlight.js/styles/github-dark.css";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";
import UserDropdown from "@/components/AdminComponents/UserDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/ThemeToggle";
import { handleShare } from "@/lib/utils";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });

const purify = (content) => DOMPurify.sanitize(content);

const Blog = ({ params }) => {
  const { id } = params;
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchBlogData = useCallback(async () => {
    try {
      const response = await axios.get("/api/blog", { params: { id } });
      setData(response.data.blog);
    } catch (error) {
      setError("Failed to load blog post. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(fetchBlogData, 500);
    return () => clearTimeout(timer);
  }, [fetchBlogData]);

  if (error) return notFound();
  if (loading) return <LoadingSkeleton />;
  if (!data) return null;

  return (
    <ScrollArea className=" flex h-screen flex-col bg-background text-foreground">
      <Header session={session} />
      <main className="flex-grow">
        <HeroSection data={data} />
        <ArticleContent data={data} />
        <ShareSection title={data?.title} />
      </main>
      <Footer />
    </ScrollArea>
  );
};

const Header = ({ session }) => (
  <header className="bg-secondary dark:bg-transparent py-4 px-6 md:px-12">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
        <Image
          src={assets.logo}
          width={40}
          height={40}
          alt="Logo"
          className="dark:invert"
        />
        <span>Blogmos v2</span>
      </Link>
      <div className="flex items-center gap-3">
        {session?.user?.isAdmin && <UserDropdown />}
        <ThemeToggle />
      </div>
    </div>
  </header>
);

const HeroSection = ({ data }) => (
  <section className="py-16 px-6 text-center bg-secondary dark:bg-transparent">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
        {data.title}
      </h1>
      <div className="flex items-center justify-center space-x-4">
        <Image
          src={data.author.profileImg}
          width={60}
          height={60}
          alt={data.author.name}
          className="rounded-full border-2 border-muted"
        />
        <div>
          <p className="font-semibold">{data.author.name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </section>
);

const ArticleContent = ({ data }) => (
  <ScrollArea>
    <Card className="max-w-3xl overflow-hidden mx-auto my-12">
      <CardContent className="pt-6">
        <Image
          src={data.image}
          width={1280}
          height={720}
          alt={data.title}
          className="w-full h-72 object-cover rounded-lg shadow-md mb-8"
        />
        <p className="text-xl text-muted-foreground mb-8">{data.description}</p>
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            img: ({ node, ...props }) => (
              <Image
                {...props}
                alt={props.alt || ""}
                className="my-4 rounded-md max-w-full h-auto mx-auto"
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table
                  className="min-w-full divide-y divide-border"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-muted" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="px-6 py-4 whitespace-nowrap" {...props} />
            ),
          }}
        >
          {purify(data.content)}
        </Markdown>
      </CardContent>
    </Card>
  </ScrollArea>
);

const ShareSection = ({ title }) => (
  <Card className="max-w-3xl mx-auto my-12">
    <CardHeader>
      <CardTitle className="dark:text-white">Share this article</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare({ title }, window.location.url)}
        >
          <IconBrandFacebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare({ title }, window.location.url)}
        >
          <IconBrandTwitterFilled className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            handleShare(
              { title, text: "\nRead more on :" },
              window.location.url
            )
          }
        >
          <IconBrandGoogle className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="max-w-3xl mx-auto px-6 py-12">
    <Skeleton className="w-full h-64 rounded-lg mb-8" />
    <Skeleton className="w-3/4 h-10 mb-4" />
    <Skeleton className="w-full h-6 mb-2" />
    <Skeleton className="w-full h-6 mb-2" />
    <Skeleton className="w-2/3 h-6 mb-8" />
    <Skeleton className="w-full h-40" />
  </div>
);

export default Blog;
