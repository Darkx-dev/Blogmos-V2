"use client";
import { assets } from "@/assets";
import axios from "axios";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { IconLoader } from "@tabler/icons-react";
const EditorComponent = dynamic(
  () => import("@/components/AdminComponents/EditorComponent"),
  { ssr: false }
);

const AddProduct = () => {
  const { data: session } = useSession();
  const [image, setImage] = useState(false);
  const [content, setContent] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Startup",
    authorImg: "/author_img.png",
  });

  useEffect(() => {
    if (session?.user) {
      setData({
        ...data,
        author: session.user.name,
        authorImg: session.user.image || "/author_img.png",
      });
    }
  }, [session]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", content);
    formData.append("category", data.category);
    formData.append("author", session?.user?._id);
    formData.append("authorImg", data.authorImg);

    const response = axios.post("/api/blog", formData);
    await toast.promise(
      response,
      {
        pending: "Posting...",
        success: "Posted Successfully",
        error: "Failed, try again",
      },
      {
        autoClose: 1000,
        onClose: () => {
          response.then((res) => {
            if (res.data.blog) {
              window.location.href = `/blogs/${res.data.blog._id}`;
            }
          });
        },
      }
    );
  };

  return (
    <form className="pt-5 px-5 sm:pt-12 sm:pl-16" onSubmit={onSubmitHandler}>
      <p className="text-xl">Upload thumbnail</p>
      <label htmlFor="image">
        <Image
          className="mt-4 aspect-video w-[180px] object-cover"
          src={!image ? assets.upload_area : URL.createObjectURL(image)}
          alt=""
          width={140}
          height={70}
          onChange={onChangeHandler}
        />
      </label>
      <input
        type="file"
        id="image"
        name="image"
        hidden
        required
        onChange={(e) => setImage(e.target.files[0])}
      />
      <p className="mt-4 text-xl">Blog title</p>
      <input
        type="text"
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border "
        name="title"
        placeholder="Type here"
        onChange={onChangeHandler}
        value={data.title}
        required
      />
      <p className="mt-4 text-xl">Blog description</p>
      <input
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border "
        name="description"
        placeholder="Write Description here"
        onChange={onChangeHandler}
        value={data.description}
        required
      />
      <p className="mt-4 text-xl">Blog Content</p>
      {/* <Suspense fallback={() => <IconLoader />}> */}
      <EditorComponent markdown={content} setContent={setContent} />
      {/* </Suspense> */}
      <p className="text-xl mt-4">Blog Category</p>
      <select
        className="w-40 mt-4 px-4 py-3 border text-gray-500"
        name="category"
        onChange={onChangeHandler}
        value={data.category}
      >
        <option value="Startup">Startup</option>
        <option value="Technology">Technology</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>
      <br />
      <button type="submit" className="mt-8 w-40 h-12 bg-black text-white">
        Add
      </button>
    </form>
  );
};

export default AddProduct;
