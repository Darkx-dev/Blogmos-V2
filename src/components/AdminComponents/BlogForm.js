"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
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
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "../ui/separator";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description is too long"),
  category: z.enum(["Startup", "Technology", "Lifestyle"]),
  content: z.string().min(1, "Content is required"),
  image: z.instanceof(File).optional(),
});

const BlogForm = ({ initialData, isEditMode }) => {
  const { data: session } = useSession();
  const [image, setImage] = useState(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "Startup",
      content: initialData?.content || "",
      image: initialData?.image || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        form.setValue("image", file);
      }
    },
    [form]
  );

  const handleClear = () => {
    // Todo: Clear All Data
    form.reset();
    setImage(null);
    fileInputRef.current.value = null;
    toast({
      type: "success",
      description: "Form cleared successfully except content",
    })
  }

  const onSubmit = async (data) => {
    if (!data.content) {
      setAlertInfo({
        type: "error",
        message: "Please write something in content",
      });
      return;
    }
    if (!image && !isEditMode) {
      setAlertInfo({ type: "error", message: "Please upload an image" });
      return;
    }

    setIsSubmitting(true);
    setAlertInfo(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("author", session?.user?._id);
    formData.append("authorImg", session?.user?.image || "/author_img.png");

    try {
      if (isEditMode) {
        await axios.put(`/api/blog`, formData, {
          params: { id: initialData._id },
        });
        setAlertInfo({
          type: "success",
          message: "Blog post updated successfully",
        });
        setTimeout(() => {
          window.location.href = `/blogs/${initialData._id}`;
        }, 1500);
      } else {
        const response = await axios.post("/api/blog", formData);
        setAlertInfo({
          type: "success",
          message: "Blog post created successfully",
        });
        setTimeout(() => {
          window.location.href = `/blogs/${response.data.blog._id}`;
        }, 1500);
      }
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: "Failed to submit blog post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <Card className=" shadow-lg rounded-lg overflow-hidden">
        <CardContent>
          <CardTitle className="text-xl">
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </CardTitle>
          <Separator className="mb-2"/>
          {alertInfo && (
            <Alert
              variant={alertInfo.type === "error" ? "destructive" : "default"}
              className="mb-6"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {alertInfo.type === "error" ? "Error" : "Success"}
              </AlertTitle>
              <AlertDescription>{alertInfo.message}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Upload Thumbnail
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                            {image && image instanceof File ? (
                              <Image
                                priority
                                className="w-full h-48 object-cover mb-2 rounded"
                                src={URL.createObjectURL(image)}
                                alt="Upload Area"
                                width={500}
                                height={250}
                              />
                            ) : (
                              image && (
                                <Image
                                  priority
                                  className="w-full h-48 object-cover mb-2 rounded"
                                  src={image}
                                  alt="Upload Area"
                                  width={500}
                                  height={250}
                                />
                              )
                            )}

                            {!image && (
                              <div className="flex flex-col items-center justify-center py-8">
                                <Upload className="w-12 h-12 " />
                                <p className="mt-2 text-sm ">
                                  Click or drag to upload
                                </p>
                              </div>
                            )}
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="mt-2"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Blog Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter blog title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold ">
                          Blog Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a brief description"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold ">
                          Blog Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Startup">Startup</SelectItem>
                            <SelectItem value="Technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 items-start gap-4">
                    <Button
                      type="submit"
                      className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? "Updating..." : "Posting..."}
                        </>
                      ) : (
                        <>{isEditMode ? "Update Blog Post" : "Add Blog Post"}</>
                      )}
                    </Button>
                    <Button className="grayscale hover:grayscale-0" variant="destructive" type="button" onClick={handleClear}>Clear All</Button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold ">
                          Blog Content
                        </FormLabel>
                        <FormControl>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <EditorComponent
                              markdown={field.value}
                              setContent={(value) =>
                                form.setValue("content", value)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;
