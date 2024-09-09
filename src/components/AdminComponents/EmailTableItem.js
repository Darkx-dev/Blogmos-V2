import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const EmailTableItem = ({ email, date, mongoId, revalidate }) => {
  const emailDate = new Date(date);

  const handleDelete = async () => {
    const response = await axios.delete("/api/email", {
      params: {
        id: mongoId,
      },
    });
    console.log(response.data);
    if (response.data.success) {
      toast.success(response.data.message);
      revalidate()
    }
  };

  return (
    <tr className="bg-white border-b text-left">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {email || "no email"}
      </th>
      <td className="px-6 py-4 hidden sm:block">
        {"11 Jan 2024"}
        {emailDate.toDateString()}
      </td>
      <td className="px-6 py-4 cursor-pointer"><IconTrash size={20} onClick={handleDelete}/></td>
    </tr>
  );
};

export default EmailTableItem;
