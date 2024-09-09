"use client"
import React, { useEffect, useState } from "react";
import BlogItem from "./BlogItem";
import axios from "axios";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  let activeStyling = "bg-black text-white py-1 px-4 rounded-sm";

  const fetchBlogs = async () => {
    const response = await axios.get("/api/blog");
    console.log(response.data.blogs)
    setBlogs(response.data.blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="flex justify-center gap-6 my-10">
        <button
          onClick={() => setMenu("All")}
          className={menu === "All" ? activeStyling : undefined}
        >
          All
        </button>
        <button
          onClick={() => setMenu("Technology")}
          className={menu === "Technology" ? activeStyling : undefined}
        >
          Technology
        </button>
        <button
          onClick={() => setMenu("Startup")}
          className={menu === "Startup" ? activeStyling : undefined}
        >
          Startup
        </button>
        <button
          onClick={() => setMenu("Lifestyle")}
          className={menu === "Lifestyle" ? activeStyling : undefined}
        >
          Lifestyle
        </button>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2 gap-y-10 mb-16 xl:mx-24">
        {blogs &&
          blogs
            .filter((blog) => (menu === "All" ? true : blog.category === menu))
            .map((blog, index) => {
              return (
                <BlogItem
                  key={index}
                  id={blog._id}
                  title={blog.title}
                  description={blog.description}
                  image={blog.image}
                  category={blog.category}
                />
              );
            })}
      </div>
    </div>
  );
};

export default BlogList;
