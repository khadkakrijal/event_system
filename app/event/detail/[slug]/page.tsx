"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import MasterLayout from "@/app/components/masterlayout/master";
import slugify from "@/app/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import { EventsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

const EventDetailPage = () => {
  const { slug } = useParams() as { slug: string };
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch all events (both past & upcoming)
  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list(); // GET /events (no mode)
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        console.error("Failed to load events:", e);
        setError("Failed to load event details.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // find the event whose slugified title matches route
  const event = useMemo(
    () => events.find((e) => slugify(e.title) === slug),
    [events, slug]
  );

  if (loading) {
    return (
      <MasterLayout>
        <div className="text-white p-10">Loading event…</div>
      </MasterLayout>
    );
  }

  if (error) {
    return (
      <MasterLayout>
        <div className="text-red-400 p-10">{error}</div>
      </MasterLayout>
    );
  }

  if (!event) {
    return (
      <MasterLayout>
        <div className="text-white p-10">Event not found</div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="flex flex-col justify-center items-center bg-black pb-10 relative">
        {/* Top Banner */}
        <div className="relative md:h-screen h-[600px] w-full">
          <Image
            src={event.featured_image || "/event-collage.avif"}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex justify-center items-center z-10">
            {event.ticket_available && (
              <Link
                href={`/buyticket?eventId=${event.id}`}
                className="flex justify-center items-center cursor-pointer h-[64px] md:w-[250px] w-[250px] bg-red-600 border text-[16px] border-white rounded text-white shadow-lg"
              >
                BUY TICKETS
              </Link>
            )}
          </div>
        </div>

        {/* Event Detail Section */}
        <div className="relative md:h-[750px] h-[800px] w-full bg-white">
          <Image
            src={"/galleryImage.avif"}
            alt={event.title}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
            <div className="text-black md:w-[75%] w-full font-abel text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold uppercase">
                {event.title}
              </h1>
              <p className="text-sm md:text-base font-medium">
                📅 {new Date(event.date).toLocaleString()} | 📍 {event.venue}
                {event.venue && event.location ? ", " : ""}
                {event.location}
              </p>
              <hr className="border border-gray-300 w-[50%] mx-auto" />

              {/* If you store a description, show it; otherwise fallback copy */}
              <p>{event.description || "Details coming soon. Stay tuned!"}</p>
              <p>
                {
                  "This event page is generated dynamically by matching the slugified title to your backend events table."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default EventDetailPage;
