'use client';

import { assets } from '@/assets';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';


const BlogTableItem = ({ authorImg, title, author, date, revalidate, mongoId }) => {
  const BlogDate = new Date(date);

  const handleDelete = async () => {
    try {
      const response = await axios.delete('/api/blog', {
        params: {
          id: mongoId,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        revalidate();
      }
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <tr className="bg-white border-b">
      <th scope="row" className="flex items-center gap-3 px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        <Image
          src={authorImg || assets.profile_icon}
          width={35}
          height={35}
          alt={author || 'no author'}
          className="rounded-full"
        />
        {author || 'No author'}
      </th>
      <td className="px-6 py-4 text-gray-700">{title || 'No title'}</td>
      <td className="px-6 py-4 text-gray-500">{BlogDate.toDateString()}</td>
      <td className="px-6 py-4">
        <div className="flex gap-3">
          {/* Delete Button */}
          <Button variant="destructive" onClick={handleDelete} className="p-1">
            <IconTrash size={20} />
          </Button>
          {/* Edit Button */}
          <Link href={`/admin/edit-blog/${mongoId}`}>
            <Button variant="outline" className="p-1">
              <IconEdit size={20} />
            </Button>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
