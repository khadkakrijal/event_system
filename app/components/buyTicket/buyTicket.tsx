"use client";

import React, { useState } from "react";
import MasterLayout from "@/app/components/masterlayout/master";
import eventsData from "@/app/components/data/eventsData";

const BuyTicket: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    eventId: "",
    quantity: 1,
  });

  const [success, setSuccess] = useState(false);

  const availableEvents = eventsData.filter(
    (event) => event.ticketAvailable === true
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ticket purchase submitted:", form);
    setSuccess(true);
    setForm({ fullName: "", email: "", eventId: "", quantity: 1 });
  };

  return (
    <MasterLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4 md:pt-[130px]">
        <div className="max-w-xl w-full bg-gray-800 p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center uppercase tracking-wider">
            Book Your Ticket
          </h1>

          {success && (
            <div className="bg-green-500 text-white px-4 py-2 rounded mb-6 text-center">
              Ticket booked successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="eventId" className="block mb-1 font-medium">
                Select Event
              </label>
              <select
                name="eventId"
                value={form.eventId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
              >
                <option value="">-- Select an Event --</option>
                {availableEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block mb-1 font-medium">
                Number of Tickets
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min={1}
                required
                className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition duration-200 px-4 py-2 rounded font-bold uppercase"
            >
              Buy Ticket
            </button>
          </form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default BuyTicket;
