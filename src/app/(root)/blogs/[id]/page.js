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
import Footer from "@/components/Footer";
import "highlight.js/styles/github-dark.css";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";
import { handleShare } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import { Separator } from "@/components/ui/separator";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });

const purify = (content) => DOMPurify.sanitize(content);

const Blog = ({ params }) => {
  const { id } = params;
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection data={data} />
        <ArticleContent data={data} />
        <Separator />
        <ShareSection title={data?.title} />
      </main>
      <Footer />
    </div>
  );
};

const Header = () => (
  <header>
    <NavBar />
  </header>
);

const HeroSection = ({ data }) => (
  <section className="py-16 px-6 text-center bg-secondary/50">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
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
  <article className="max-w-3xl mx-auto px-6 py-12">
    <Image
      src={data.image}
      width={1280}
      height={720}
      alt={data.title}
      className="w-full h-auto aspect-video object-cover rounded-lg shadow-md mb-8"
    />
    <p className="text-xl text-muted-foreground mb-8">{data.description}</p>
    <div className="prose dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          img: ({ node,width, height, ...props }) => (
            <Image
              src={props.src}
              alt={props.alt || ""}
              width={width || 400}
              height={height ||300}
              className="my-4 rounded-md max-w-full size-full mx-auto"
            />
          ),
          code: ({ node, className, ...props }) => (
            <pre className={`${className} p-3 rounded-md my-2`} {...props}>
              <code {...props}>{props.children}</code>
            </pre>
          ),
        }}
      >
        {purify(data.content)}
      </Markdown>
    </div>
  </article>
);

const ShareSection = ({ title }) => (
  <div className="max-w-3xl mx-auto my-12 px-6 shadow-none">
    <div>
      <h3>Share this article</h3>
    </div>
    <div>
      <div className="flex space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare({ title }, window.location.href)}
        >
          <IconBrandFacebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare({ title }, window.location.href)}
        >
          <IconBrandTwitterFilled className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            handleShare(
              { title, text: "\nRead more on :" },
              window.location.href
            )
          }
        >
          <IconBrandGoogle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
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
