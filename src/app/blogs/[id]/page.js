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
import { assets } from "@/assets";
import Footer from "@/components/Footer";
import "highlight.js/styles/github-dark.css";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";
import UserDropdown from "@/components/AdminComponents/UserDropdown";

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
      console.log(response.data.blog);
      setData(response.data.blog);
    } catch (error) {
      setError("Failed to load blog post. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  if (error) return notFound();
  if (loading) return <LoadingSkeleton />;
  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header session={session} />
      <main className="flex-grow">
        <HeroSection data={data} />
        <ArticleContent data={data} />
        <ShareSection />
      </main>
      <Footer />
    </div>
  );
};

const Header = ({ session }) => (
  <header className="bg-gray-200 py-4 px-6 md:px-12">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
        <Image src={assets.logo} width={40} height={40} alt="Logo" />
        <span>Blogmos v2</span>
      </Link>
      {session?.user?.isAdmin && <UserDropdown />}
    </div>
  </header>
);

const HeroSection = ({ data }) => (
  <section className="py-16 px-6 text-center bg-gray-200">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
      <div className="flex items-center justify-center space-x-4">
        <Image
          src={data.author.profileImg}
          width={60}
          height={60}
          alt={data.author.name}
          className="rounded-full border-2 border-gray-300"
        />
        <div>
          <p className="font-semibold">{data.author.name}</p>
          <p className="text-sm text-gray-600">
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
      className="w-full h-72 object-cover rounded-lg shadow-md mb-8"
    />
    <p className="text-xl text-gray-700 mb-8">{data.description}</p>
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        img: (props) => (
          <img
            {...props}
            alt={props.alt}
            className="my-4 rounded-md max-w-full h-auto"
          />
        ),
        table: (props) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-200 border">
              {props.children}
            </table>
          </div>
        ),
        thead: (props) => (
          <thead {...props} className="bg-gray-50">
            {props.children}
          </thead>
        ),
        th: (props) => (
          <th
            {...props}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {props.children}
          </th>
        ),
        td: (props) => (
          <td {...props} className="px-6 py-4 whitespace-nowrap">
            {props.children}
          </td>
        ),
      }}
    >
      {purify(data.content)}
    </Markdown>
  </article>
);

const ShareSection = () => (
  <section className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-200">
    <h2 className="text-2xl font-semibold mb-4">Share this article</h2>
    <div className="flex space-x-4">
      {/* {['facebook', 'twitter', 'googleplus'].map((platform) => (
        <Button key={platform} variant="outline" size="icon">
          <Image
            src={assets[`${platform}_icon`]}
            width={24}
            height={24}
            alt={platform}
          />
        </Button>
      ))} */}
      <IconBrandFacebook size={20} />
      <IconBrandTwitterFilled size={20} />
      <IconBrandGoogle size={20} />
    </div>
  </section>
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
