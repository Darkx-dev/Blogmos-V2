"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const [fieldData, setFieldData] = useState({
    name: "",
    // email: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFieldData({
        name: session.user.name || "",
        // email: session.user.email || "",
      });
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFieldData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("/api/profile", {
        ...fieldData,
        id: session?.user?._id,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await update({ user: response.data.updatedUser });
      } else {
        toast.error("Error Updating Profile");
      }
    } catch (error) {
      toast.error("Error Updating Profile");
    }
  };

  return (
    <form className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 space-y-4" onSubmit={onSubmitHandler}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={fieldData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full border rounded-md py-2 px-3"
        />
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={fieldData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full border rounded-md py-2 px-3"
        />
      </div> */}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white font-semibold"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfilePage;
