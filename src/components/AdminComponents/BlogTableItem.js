import { assets } from "@/assets";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const BlogTableItem = ({
  authorImg,
  title,
  author,
  date,
  revalidate,
  mongoId,
}) => {
  const BlogDate = new Date(date);
  const handleDelete = async () => {
    const response = await axios.delete("/api/blog", {
      params: {
        id: mongoId,
      },
    });
    if (response.data.success) {
      toast.success(response.data.message);
      revalidate();
    }
  };
  return (
    <tr className="bg-white border-b">
      <th
        scope="row"
        className="items-center gap-2 hidden sm:flex px-6 py-4 font-medium whitespace-nowrap"
      >
        <Image
          src={authorImg ? authorImg : assets.profile_icon}
          width={35}
          height={35}
          alt={author}
        />
        {author ? author : "no author"}
      </th>
      <td className="px-6 py-4">{title ? title : "no title"}</td>
      <td className="px-6 py-4">{BlogDate.toDateString()}</td>
      <td className="px-6 py-4 cursor-pointer gap-4">
        <div className="flex gap-3">
          <IconTrash
            size={25}
            onClick={handleDelete}
            className="hover:text-red-500 inline-block"
          />
          <Link href={`/admin/edit-blog/${mongoId}`} className="hover:text-black" >
          <IconEdit size={25} className="" />
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
