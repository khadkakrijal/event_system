// pages/admin/attendees.tsx
import React from "react";

const AdminAttendeesPage = () => {
  const attendees = [
    { id: 1, name: "John Doe", email: "john@example.com", ticketType: "VIP", checkedIn: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", ticketType: "General", checkedIn: false },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", ticketType: "VIP", checkedIn: true }
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendee List</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Ticket Type</th>
              <th className="px-4 py-2 text-left">Checked In</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id} className="border-t">
                <td className="px-4 py-2">{attendee.id}</td>
                <td className="px-4 py-2">{attendee.name}</td>
                <td className="px-4 py-2">{attendee.email}</td>
                <td className="px-4 py-2">{attendee.ticketType}</td>
                <td className="px-4 py-2">{attendee.checkedIn ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendeesPage;