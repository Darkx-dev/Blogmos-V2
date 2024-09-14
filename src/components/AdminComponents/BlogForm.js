"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const BlogForm = ({ initialData, isEditMode }) => {
  const { data: session } = useSession();
  const [image, setImage] = useState(initialData?.image || null);
  const [content, setContent] = useState(initialData?.content || "");
  const [data, setData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Startup",
    authorImg: session?.user?.image || "/author_img.png",
    author: session?.user?.name || "",
  });
  const submitButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log(initialData);
  }, [initialData]);

  const onChangeHandler = useCallback((e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!content) return toast.error("Please write something in content");
    if (!image) return toast.error("Please upload an image");

    submitButtonRef.current.disabled = true;
    submitButtonRef.current.textContent = isEditMode ? "Updating" : "Posting";

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", content);
    formData.append("category", data.category);
    formData.append("author", session?.user?._id);
    formData.append("authorImg", data.authorImg);

    try {
      if (isEditMode) {
        try {
          await axios.put(`/api/blog`, formData, {
            params: { id: initialData._id },
          });
          setTimeout(() => {
            window.location.href = `/blogs/${initialData._id}`;
          }, 500);
        } catch (err) {
          toast.error("Failed to update blog post");
          return;
        }
      } else {
        try {
          const response = await axios.post("/api/blog", formData);
          console.log(response.data);
          setTimeout(() => {
            window.location.href = `/blogs/${response.data.blog._id}`;
          }, 500);
        } catch (err) {
          toast.error("Failed to add blog post");
          return;
        }
      }
    } catch (error) {
      toast.error("Failed, try again");
    } finally {
      submitButtonRef.current.disabled = false;
    }
  };

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className=" font-bold">
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitHandler}>
            <div className="md:grid grid-cols-3 gap-8">
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="image"
                    className="text-lg font-semibold block"
                  >
                    <p className="mb-4">Upload Thumbnail</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer">
                      {image && (
                        <img
                          className="w-full h-48 object-cover mb-2"
                          src={image}
                          alt="Upload Area"
                          width={500}
                          height={250}
                        />
                      )}
                      {!image && <Upload className="mx-auto my-10" />}
                      <Input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-2"
                      />
                    </div>
                  </Label>
                </div>
                <div>
                  <Label
                    htmlFor="title"
                    className="text-lg font-semibold mb-2 block"
                  >
                    Blog Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter blog title"
                    onChange={onChangeHandler}
                    value={data.title}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-lg font-semibold mb-2 block"
                  >
                    Blog Description
                  </Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Write a brief description"
                    onChange={onChangeHandler}
                    value={data.description}
                    required
                  />
                </div>
                <div className="grid lg:grid-cols-2 items-end gap-5">
                  <div>
                    <Label
                      htmlFor="category"
                      className="text-lg font-semibold mb-2 block"
                    >
                      Blog Category
                    </Label>
                    <Select
                      value={data.category}
                      required
                      onValueChange={(value) =>
                        setData((prevData) => ({
                          ...prevData,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    ref={submitButtonRef}
                    type="submit"
                    className="w-full mt-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isEditMode ? "Update Blog Post" : "Add Blog Post"}
                  </Button>
                </div>
              </div>
              <div className="col-span-2">
                <Label
                  htmlFor="content"
                  className="text-lg font-semibold mb-4 block"
                >
                  Blog Category
                </Label>
                <EditorComponent markdown={content} setContent={setContent} />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;
