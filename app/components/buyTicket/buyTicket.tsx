"use client";

import React, { useEffect, useMemo, useState } from "react";
import MasterLayout from "@/app/components/masterlayout/master";
import { useRouter, useSearchParams } from "next/navigation";
import { EventsAPI, TicketsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";
import slugify from "@/app/utils/slugify";


const BuyTicket: React.FC = () => {
  const searchParams = useSearchParams();

  // Read incoming params (we prefer eventId, but also support slug fallback)
  const eventIdParam = searchParams.get("eventId");
  const slugParam = searchParams.get("slug");

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
    const router = useRouter(); 

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    eventId: "",   // string for <select>; we’ll coerce to number on submit
    quantity: 1,
    ticketType: "Standard",
  });

  // Fetch events
  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list(); // all events
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        console.error("Failed to load events:", e);
        setError("Failed to load events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Compute available (sellable) events
  const availableEvents = useMemo(
    () => events.filter((e) => e.ticket_available === true),
    [events]
  );

  // Prefill the selected event when events arrive or params change
  useEffect(() => {
    if (loading) return;

    // 1) Try eventId param
    if (eventIdParam) {
      const idNum = Number(eventIdParam);
      const exists = availableEvents.some((e) => e.id === idNum);
      if (exists) {
        setForm((prev) => ({ ...prev, eventId: String(idNum) }));
        return;
      }
    }

    // 2) Fallback to slug param
    if (slugParam) {
      const match = availableEvents.find((e) => slugify(e.title) === slugParam);
      if (match) {
        setForm((prev) => ({ ...prev, eventId: String(match.id) }));
        return;
      }
    }
    // If neither matched, leave as-is (user can choose)
  }, [loading, eventIdParam, slugParam, availableEvents]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? Math.max(1, Number(value) || 1)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const event_id = Number(form.eventId);
      if (!event_id || Number.isNaN(event_id)) {
        setError("Please select an event.");
        return;
      }

      await TicketsAPI.create({
        event_id,
        username: form.fullName,
        email: form.email,
        quantity: form.quantity,
        ticket_type: form.ticketType || "Standard",
      });

      setSuccess("Ticket booked successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1500);

      setForm((prev) => ({
        fullName: "",
        email: "",
        eventId: prev.eventId,
        quantity: 1,
        ticketType: "Standard",
      }));
    } catch (err: any) {
      console.error("Ticket create failed:", err);
      setError(err?.message || "Failed to create ticket.");
    }
  };

  return (
    <MasterLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4 md:pt-[130px]">
        <div className="max-w-xl w-full bg-gray-800 p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center uppercase tracking-wider">
            Book Your Ticket
          </h1>

          {loading && <div className="mb-6 text-center">Loading events…</div>}
          {!loading && success && (
            <div className="bg-green-500 text-white px-4 py-2 rounded mb-6 text-center">
              {success}
            </div>
          )}
          {!loading && error && (
            <div className="bg-red-600 text-white px-4 py-2 rounded mb-6 text-center">
              {error}
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
                disabled={loading}
              >
                <option value="">-- Select an Event --</option>
                {availableEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {(!loading && availableEvents.length === 0) && (
                <p className="mt-2 text-sm text-gray-300">
                  No events currently selling tickets.
                </p>
              )}
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

            {/* Optional ticket type */}
            <div>
              <label htmlFor="ticketType" className="block mb-1 font-medium">
                Ticket Type
              </label>
              <select
                name="ticketType"
                value={form.ticketType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
              >
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition duration-200 px-4 py-2 rounded font-bold uppercase"
              disabled={loading}
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
