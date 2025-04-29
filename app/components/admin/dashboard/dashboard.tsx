import React from "react";
import { Card } from "primereact/card";
import { FaUsers, FaCalendarAlt, FaImages, FaTicketAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const summaryData = [
    {
      title: "Total Events",
      value: 12,
      icon: <FaCalendarAlt className="text-3xl text-blue-500" />,
    },
    {
      title: "Total Gallery Items",
      value: 24,
      icon: <FaImages className="text-3xl text-purple-500" />,
    },
    {
      title: "Tickets Sold",
      value: 340,
      icon: <FaTicketAlt className="text-3xl text-green-500" />,
    },
    {
      title: "Attendees",
      value: 280,
      icon: <FaUsers className="text-3xl text-orange-500" />,
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((data, index) => (
          <Card
            key={index}
            title={data.title}
            className="shadow-md border-t-4 border-blue-500 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {data.value}
                </h2>
              </div>
              <div>{data.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h2>
        <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          <li className="p-4 text-gray-700">
            User John Doe purchased 3 tickets for &quot;AI Conference&quot;
          </li>
          <li className="p-4 text-gray-700">
            New event &quot;Cultural Fest 2025&quot; was added
          </li>
          <li className="p-4 text-gray-700">
            Admin uploaded 5 new photos to &quot;Talent Night&quot;
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
