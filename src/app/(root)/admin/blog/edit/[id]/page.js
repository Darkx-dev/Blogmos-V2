"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "@/components/AdminComponents/BlogForm";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }) {
  const [blogData, setBlogData] = useState(null);
  const { id } = params; // Assuming you get the blog ID from the route

  const fetchBlogData = async () => {
    try {
      const response = await axios.get(`/api/blog`, { params: { id } });
      // console.log(response.data.blog);
      setBlogData(response.data.blog);
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
    }
  };
  useEffect(() => {
    console.log("Fetching blog data");
    let timer;
    if (id) timer = setTimeout(fetchBlogData, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!blogData) return <p>Loading...</p>;

  return <BlogForm isEditMode={true} initialData={blogData} />;
}
