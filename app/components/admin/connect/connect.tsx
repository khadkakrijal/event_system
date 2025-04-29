import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface ContactEntry {
  id: number;
  name: string;
  email: string;
  contact: string;
  message: string;
}

const AdminConnectPage = () => {
  const contactData: ContactEntry[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      contact: "0412345678",
      message: "Looking forward to the next event!"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      contact: "0498765432",
      message: "Please send me ticket updates."
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      contact: "0400123456",
      message: "I’d like to volunteer for future events."
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Submissions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
        <DataTable value={contactData} paginator rows={5} stripedRows className="p-datatable-sm border border-gray-300">
          <Column field="name" header="Name" bodyClassName="border border-gray-200 px-2 py-1" />
          <Column field="email" header="Email" bodyClassName="border border-gray-200 px-2 py-1" />
          <Column field="contact" header="Contact" bodyClassName="border border-gray-200 px-2 py-1" />
          <Column field="message" header="Comments" bodyClassName="border border-gray-200 px-2 py-1" />
        </DataTable>
      </div>
    </div>
  );
};

export default AdminConnectPage;
