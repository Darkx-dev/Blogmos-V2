'use client';

import { IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

const EmailTableItem = ({ email, date, mongoId, revalidate }) => {
  const emailDate = new Date(date);

  const handleDelete = async () => {
    try {
      const response = await axios.delete('/api/email', {
        params: {
          id: mongoId,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        revalidate();
      } else {
        toast.error('Failed to delete email');
      }
    } catch (error) {
      toast.error('Error deleting email');
    }
  };

  return (
    <tr className="bg-white border-b text-left">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {email || 'No email'}
      </th>
      <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
        {emailDate.toDateString()}
      </td>
      <td className="px-6 py-4">
        <Button variant="destructive" onClick={handleDelete} className="p-1">
          <IconTrash size={20} />
        </Button>
      </td>
    </tr>
  );
};

export default EmailTableItem;
