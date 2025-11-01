// app/components/calendar/CalendarPage.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import EventCalendar from "./dateSlider";
import EventCards from "./Card";
import { EventsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

export type MonthRow = {
  key: string;   // "YYYY-MM"
  title: string; // "Jan", "Feb", ...
  count: number; // events in that month
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthTitle(idx: number) {
  return new Date(2000, idx, 1).toLocaleString(undefined, { month: "short" });
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list({ mode: "upcoming" });
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load events:", e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build 12 months from "now" and count events per month
  const months: MonthRow[] = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const buckets: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
      const m = new Date(start.getFullYear(), start.getMonth() + i, 1);
      buckets[monthKey(m)] = 0;
    }

    events.forEach((e) => {
      const d = new Date(e.date);
      const key = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      if (key in buckets) buckets[key] += 1;
    });

    return Array.from({ length: 12 }).map((_, i) => {
      const m = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = monthKey(m);
      return {
        key,
        title: monthTitle(m.getMonth()),
        count: buckets[key] ?? 0,
      };
    });
  }, [events]);

  // Events for selected month (or all upcoming if none selected)
  const filteredEvents = useMemo(() => {
    const list = events
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (!selectedMonthKey) return list;

    const [y, m] = selectedMonthKey.split("-").map(Number);
    return list.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    });
  }, [events, selectedMonthKey]);

  return (
    <div className="bg-black min-h-screen">
      <EventCalendar
        data={months}
        selectedKey={selectedMonthKey}
        onSelect={(key) => setSelectedMonthKey(key)}
        loading={loading}
      />
      <EventCards events={filteredEvents} loading={loading} />
    </div>
  );
};

export default CalendarPage;
