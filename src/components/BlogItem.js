import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BlogItem = ({
  id,
  title,
  category,
  description,
  image,
  createdAt,
  updatedAt,
}) => {
  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300" >
      <Link href={`/blogs/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            priority
            src={image}
            alt={title}
            width={200}
            height={150}
            className="group-hover:scale-105 w-full h-full transition-transform duration-300 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity duration-300" />
          <span className="absolute top-4 left-4 bg-white text-black text-xs font-semibold px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </Link>
      <CardHeader className="pt-4 pb-2">
        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{description}</p>
        <div className="flex items-center text-xs text-gray-500 space-x-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/blogs/${id}`} className="w-full">
          <Button variant="outline" className="w-full group">
            Read more
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogItem;
