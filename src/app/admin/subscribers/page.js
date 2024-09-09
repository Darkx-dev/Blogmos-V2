"use client";
import EmailTableItem from "@/components/AdminComponents/EmailTableItem";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const fetchEmails = async () => {
    const response = await axios.get("/api/email");
    setSubscribers(response.data.emails);
  };
  useEffect(() => {
    fetchEmails();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h4>All subscribers</h4>
      <div className="relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-black">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email Subscribers
              </th>
              <th scope="col" className="hidden sm:block px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((email, index) => {
              return (
                <EmailTableItem
                  key={index}
                  email={email.email}
                  mongoId={email._id}
                  date={email.date}
                  revalidate={fetchEmails}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscribers;
