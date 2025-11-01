"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ReportsAPI } from "@/app/api/apiService";
import type { ReportSummary, ReportEventRow } from "@/app/api/apiContract";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { EventsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

const ReportsPage: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // filters
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [eventId, setEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const evts = await EventsAPI.list();
      setEvents(Array.isArray(evts) ? evts : []);
    })();
  }, []);

  const eventOptions: { label: string; value: number | null }[] = [
    { label: "All events", value: null },
    ...events.map((e) => ({ label: e.title, value: e.id })),
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ReportsAPI.summary({
        from: from || undefined,
        to: to || undefined,
        eventId: eventId ?? undefined,
      });
      setSummary(data);
    } catch (e) {
      console.error(e);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApply = () => loadData();
  const onReset = () => {
    setFrom("");
    setTo("");
    setEventId(null);
    loadData();
  };

  const exportCSV = () => {
    if (!summary) return;
    const rows = summary.perEvent;
    const headers = [
      "Event ID",
      "Event Title",
      "Event Date",
      "Tickets Sold",
      "Unique Buyers",
      "Last Purchase",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.event_id,
          `"${r.event_title.replace(/"/g, '""')}"`,
          r.event_date,
          r.tickets_sold,
          r.unique_buyers,
          r.last_purchase_at ?? "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "per-event-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

      {/* Filters */}
      <div className="bg-white rounded-md shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <InputText
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <InputText
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className=""
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Event</label>
          <Dropdown
            value={eventId}
            options={eventOptions}
            onChange={(e) => setEventId(e.value)}
            placeholder="Select Event"
            className="w-full bg-gray-200 px-2 rounded sm"
            panelClassName=" bg-gray-100 rounded-sm px-2 py-2"
            optionLabel="label"
            optionValue="value"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            label="Apply"
            className="bg-blue-600 text-white px-2 rounded-sm"
            onClick={onApply}
          />
          <Button
            label="Reset"
            className="bg-gray-500 text-white px-2 rounded-sm"
            onClick={onReset}
          />
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold">
            {summary?.counters.totalEvents ?? "-"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Tickets Sold</p>
          <p className="text-2xl font-bold">
            {summary?.counters.ticketsSold ?? "-"}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Unique Buyers</p>
          <p className="text-2xl font-bold">
            {summary?.counters.uniqueBuyers ?? "-"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Daily Ticket Sales</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary?.daily || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets_sold" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Per-Event Breakdown</h2>
          <Button
            label="Export CSV"
            className="bg-emerald-600 text-white px-2 py-1 rounded-sm"
            onClick={exportCSV}
          />
        </div>

        <DataTable
          value={summary?.perEvent || []}
          loading={loading}
          paginator
          rows={10}
          stripedRows
          className="p-datatable-sm"
        >
          <Column
            field="event_title"
            header="Event"
            bodyClassName="truncate max-w-[220px]"
          />
          <Column
            field="event_date"
            header="Date"
            body={(r: ReportEventRow) =>
              new Date(r.event_date).toLocaleString()
            }
          />
          <Column field="tickets_sold" header="Tickets" />
          <Column field="unique_buyers" header="Buyers" />
          <Column
            field="last_purchase_at"
            header="Last Purchase"
            body={(r: ReportEventRow) =>
              r.last_purchase_at
                ? new Date(r.last_purchase_at).toLocaleString()
                : "-"
            }
          />
        </DataTable>
      </div>
    </div>
  );
};

export default ReportsPage;
