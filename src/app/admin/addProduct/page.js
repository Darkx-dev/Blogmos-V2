"use client";
import { assets } from "@/assets";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import EditorComponent from "@/components/AdminComponents/EditorComponent";

const AddProduct = () => {
  const { data: session } = useSession();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Startup",
    authorImg: "/author_img.png",
  });
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      setData((prevData) => ({
        ...prevData,
        author: session.user.name,
        authorImg: session.user.image || "/author_img.png",
      }));
    }
  }, [session]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!content) return toast.error("Please write something in content")
    if (!image) {
      toast.error("Please upload an image");
      return;
    }
    submitButtonRef.current.disabled = true;
    submitButtonRef.current.textContent = "Posting";

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
        autoClose: 800,
        onClose: () => {
          response.then((res) => {
            if (res.data.blog) {
              submitButtonRef.current.textContent = "Posted";
              window.location.href = `/blogs/${res.data.blog._id}`;
            }
          });
        },
      }
    );
  };

  return (
    <form className="p-5 sm:p-12" onSubmit={onSubmitHandler}>
      <div className="mb-6">
        <p className="text-xl font-semibold">Upload thumbnail</p>
        <label htmlFor="image" className="block mt-4 cursor-pointer">
          <Image
            className="w-auto h-auto object-cover mb-4 dark:invert"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload Area"
            width={500}
            height={250}
          />
        </label>
        <Input
          type="file/image"
          id="image"
          name="image"
          hidden
          required
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <div className="mb-6">
        <p className="text-xl font-semibold">Blog title</p>
        <Input
          type="text"
          name="title"
          placeholder="Type here"
          onChange={onChangeHandler}
          value={data.title}
          required
        />
      </div>
      <div className="mb-6">
        <p className="text-xl font-semibold">Blog description</p>
        <Input
          type="text"
          name="description"
          placeholder="Write Description here"
          onChange={onChangeHandler}
          value={data.description}
          required
        />
      </div>
      <div className="mb-6">
        <p className="text-xl font-semibold">Blog Content</p>
        <EditorComponent markdown={content} setContent={setContent} />
      </div>
      <div className="mb-6">
        <p className="text-xl font-semibold">Blog Category</p>
        <div className="flex items-center justify-start gap-4">
          <Select
            value={data.category}
            required
            onValueChange={(value) =>
              setData((prevData) => ({ ...prevData, category: value }))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Startup">Startup</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
          <Button
            ref={submitButtonRef}
            type="submit"
            className="w-full py-2 bg-black dark:bg-transparent dark:border text-white"
          >
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
