import React from "react";

const AdminReportsPage = () => {
  const reportSummary = {
    totalEvents: 12,
    totalAttendees: 240,
    ticketsSold: 180,
    revenue: 3600
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-gray-600">Total Events</h2>
          <p className="text-2xl font-bold text-black">{reportSummary.totalEvents}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-gray-600">Total Attendees</h2>
          <p className="text-2xl font-bold text-black">{reportSummary.totalAttendees}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-gray-600">Tickets Sold</h2>
          <p className="text-2xl font-bold text-black">{reportSummary.ticketsSold}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-gray-600">Revenue ($)</h2>
          <p className="text-2xl font-bold text-black">${reportSummary.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
