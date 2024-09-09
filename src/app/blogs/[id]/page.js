"use client";
import { assets } from "@/assets";
import Footer from "@/components/Footer";
import axios from "axios";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
const Markdown = dynamic(() => import("react-markdown"), { ssr: false });
import 'highlight.js/styles/github.css';
import rehypeHighlight from "rehype-highlight";
import { notFound } from "next/navigation";

const purify = (content) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return sanitizedContent;
};

const Blog = ({ params }) => {
  const { id } = params;
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

 const fetchBlogData = async () => {
  try {
    const response = await axios.get("/api/blog", {
      params: { id },
    });
    setData(response.data.blog);
  } catch (error) {
    // You could set an error state here and display an error message to the user
    setError("Failed to load blog post. Please try again later.");
  }
};

  useEffect(() => {
    fetchBlogData();
  }, []);

  if (error) notFound()
  if (!data) return null;
  return (
    <>
      <div className="bg-gray-200 py-5 h-1/2 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center text-lg sm:text-2xl">
          <Link href={"/"} className="flex items-center gap-1">
            <Image
              src={assets.logo}
              width={180}
              alt=""
              className="w-[30px] sm:w-auto"
            />
            <span>Blogmos v2</span>
          </Link>
          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
            Get started <Image src={assets.arrow} alt="" />
          </button>
        </div>
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <Image
            className="mx-auto mt-6 border border-white rounded-full"
            src={data.author.profileImg}
            width={60}
            height={60}
            alt=""
          />
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author.name}
          </p>
        </div>
      </div>
      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image
          src={data.image}
          width={1280}
          height={720}
          alt=""
          className="border-4 border-white max-h-[50vh] object-cover"
        />
        <p>{data.description}</p>
        <div className="mt-10">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              img: (props) => {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img {...props} alt={props.alt} className="mt-1"/>
                );
              },
              table: (props) => {
                const { children } = props;
                return (
                  <div className="overflow-x-auto mt-1">
                    <table className="min-w-full divide-y divide-gray-200">
                      {children}
                    </table>
                  </div>
                );
              },
              thead: (props) => (
                <thead {...props} className="bg-gray-100">
                  {props.children}
                </thead>
              ),
              tbody: (props) => (
                <tbody {...props} >
                  {props.children}
                </tbody>
              ),
              tr: (props) => <tr {...props}  className="border">{props.children}</tr>,
              th: (props) => (
                <th {...props} className="border border-black" >
                  {props.children}
                </th>
              ),
              td: (props) => <td {...props} className="border px-1">{props.children}</td>,
            }}
          >
            {purify(data.content)}
          </Markdown>
        </div>
        <div className="my-24">
          <p className="text-black font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex">
            <Image
              src={assets.facebook_icon}
              width={50}
              height={50}
              alt=""
              className="mr-4"
            />
            <Image
              src={assets.twitter_icon}
              width={50}
              height={50}
              alt=""
              className="mr-4"
            />
            <Image src={assets.googleplus_icon} width={50} height={50} alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
