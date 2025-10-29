"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { TicketsAPI, EventsAPI } from "@/app/api/apiService";
import type { Event, Ticket } from "@/app/api/apiContract";

type EventOption = { label: string; value: number | null };

const AdminAttendeesPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventFilter, setEventFilter] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load events for dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    })();
  }, []);

  // Load tickets based on filter
  const loadTickets = async (eventId?: number | null) => {
    setLoading(true);
    try {
      const data = await TicketsAPI.list({
        eventId: eventId ?? undefined, // ensure correct type
      });
      setTickets(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error("Error loading tickets:", err);
      setError("Failed to load attendees.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets(eventFilter);
  }, [eventFilter]);

  // Build event dropdown options
  const eventOptions: EventOption[] = useMemo(
    () => [
      { label: "All Events", value: null },
      ...events.map((e) => ({ label: e.title, value: e.id })),
    ],
    [events]
  );

  // Format purchased date
  const dateTemplate = (row: Ticket) =>
    new Date(row.purchased_date).toLocaleString();

  // If needed, show event title for each ticket
  const eventTemplate = (row: Ticket) =>
    events.find((e) => e.id === row.event_id)?.title || "—";

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendee List</h1>

        <Dropdown
          value={eventFilter}
          options={eventOptions}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => setEventFilter(e.value)}
          placeholder="Filter by Event"
          className="w-full md:w-64 bg-slate-300 border-gray-300 text-gray-800 rounded-md p-2"
          panelClassName="bg-slate-300 text-gray-800 rounded-md shadow-lg p-2"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
        <DataTable
          value={tickets}
          paginator
          rows={8}
          stripedRows
          loading={loading}
          className="p-datatable-sm text-gray-800 p-2 "
          emptyMessage={
            loading ? "Loading attendees..." : "No attendees found."
          }
        >
          <Column field="username" header="Name" bodyClassName=" w-[120px]"/>
          <Column field="email" header="Email" bodyClassName=" max-w-[100px] truncate" />
          <Column field="ticket_type" header="Ticket Type" />
          <Column field="quantity" header="Qty" style={{ width: "80px" }} />
          <Column
            field="event_id"
            header="Event"
            bodyClassName=" max-w-[100px] truncate" 
            body={eventTemplate}
            
          />
          <Column
            field="purchased_date"
            header="Purchased On"
            body={dateTemplate}
            bodyClassName="max-w-[100px] truncate"
            
          />
        </DataTable>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default AdminAttendeesPage;
