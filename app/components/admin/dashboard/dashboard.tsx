"use client";

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { FaUsers, FaCalendarAlt, FaImages, FaTicketAlt } from "react-icons/fa";
import { EventsAPI, GalleriesAPI, TicketsAPI } from "@/app/api/apiService";

interface DashboardSummary {
  totalEvents: number;
  totalGalleries: number;
  totalTickets: number;
  totalAttendees: number;
}

interface ActivityItem {
  id: number;
  message: string;
  date: string;
}

const AdminDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEvents: 0,
    totalGalleries: 0,
    totalTickets: 0,
    totalAttendees: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, galleries, tickets] = await Promise.all([
          EventsAPI.list(),
          GalleriesAPI.list(),
          TicketsAPI.list(),
        ]);

        // Derive counts
        const totalEvents = events?.length || 0;
        const totalGalleries = galleries?.length || 0;
        const totalTickets = tickets?.reduce((sum, t) => sum + (t.quantity || 1), 0) || 0;
        const totalAttendees = new Set(tickets?.map(t => t.email)).size || 0;

        setSummary({ totalEvents, totalGalleries, totalTickets, totalAttendees });

        // Generate recent activity
        const activities: ActivityItem[] = [];

        if (tickets.length > 0) {
          const latestTicket = tickets[tickets.length - 1];
          activities.push({
            id: 1,
            message: `🎟️ ${latestTicket.username} purchased ${latestTicket.quantity} ticket(s) for event ID ${latestTicket.event_id}`,
            date: latestTicket.purchased_date,
          });
        }

        if (events.length > 0) {
          const latestEvent = events[events.length - 1];
          activities.push({
            id: 2,
            message: `📅 New event "${latestEvent.title}" was added.`,
            date: latestEvent.date,
          });
        }

        if (galleries.length > 0) {
          const latestGallery = galleries[galleries.length - 1];
          activities.push({
            id: 3,
            message: `🖼️ New gallery "${latestGallery.title}" added.`,
            date: latestGallery.created_at || new Date().toISOString(),
          });
        }

        // Sort recent items by date (newest first)
        setRecentActivity(
          activities.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryData = [
    {
      title: "Total Events",
      value: summary.totalEvents,
      icon: <FaCalendarAlt className="text-3xl text-blue-500" />,
      border: "border-blue-500",
    },
    {
      title: "Total Gallery Items",
      value: summary.totalGalleries,
      icon: <FaImages className="text-3xl text-purple-500" />,
      border: "border-purple-500",
    },
    {
      title: "Tickets Sold",
      value: summary.totalTickets,
      icon: <FaTicketAlt className="text-3xl text-green-500" />,
      border: "border-green-500",
    },
    {
      title: "Unique Attendees",
      value: summary.totalAttendees,
      icon: <FaUsers className="text-3xl text-orange-500" />,
      border: "border-orange-500",
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((data, index) => (
          <Card
            key={index}
            title={data.title}
            className={`shadow-md border-t-4 ${data.border} p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {loading ? "..." : data.value}
                </h2>
              </div>
              <div>{data.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading activity...</p>
        ) : recentActivity.length === 0 ? (
          <p className="text-gray-500">No recent activity available.</p>
        ) : (
          <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {recentActivity.map((item) => (
              <li key={item.id} className="p-4 text-gray-700 flex justify-between">
                <span>{item.message}</span>
                <span className="text-sm text-gray-400">
                  {new Date(item.date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
