"use client";

import React, { useEffect, useMemo, useState } from "react";
import MasterLayout from "../../masterlayout/master";
import Link from "next/link";
import slugify from "@/app/utils/slugify";
import Image from "next/image";
import { EventsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

const PastEvent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list({ mode: "past" }); // ✅ ask backend for past
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        console.error("EventsAPI error:", e);
        setError("Failed to load events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = Date.now();

  // Double-guard: filter past events on client & sort descending by date
  const pastSorted = useMemo(() => {
    return events
      .filter((e) => new Date(e.date).getTime() < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, now]);

  const visibleEvents = pastSorted.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <MasterLayout>
      <div
        className={`bg-black flex flex-col gap-6 justify-center items-center ${
          error ? "pt-[69px]" : "pt-40"
        } pb-16`}
      >
        {loading && error && (
          <h2 className="text-3xl font-bold uppercase text-white mb-4">
            Highlights from the Past
          </h2>
        )}

        {loading && <p className="text-white/80">Loading events…</p>}
        {error && <p className="text-red-400">Error: {error}</p>}
        {!loading && !error && visibleEvents.length === 0 && (
          <p className="text-white/80">No past events found.</p>
        )}

        {!loading &&
          !error &&
          visibleEvents.map((data) => (
            <Link href={`/event/gallery/${slugify(data.title)}`} key={data.id}>
              <div className="relative md:w-[66.5vw] md:h-[31.25vw] md:border-[2vw] rounded w-[90.4vw] h-[42.5vw] xs:border-[3vw] border-gray-300 hover:border-gray-500 cursor-pointer">
                <Image
                  src={data.featured_image || "/events.jpg"}
                  height={100}
                  width={100}
                  className="md:h-[27.29vw] md:w-[62.5vw] rounded border md:w-full object-cover w-[84.5vw] h-[36.8vw]"
                  alt={data.title}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/60 px-6 py-3 rounded text-black text-xl font-bold text-center">
                    {data.title}
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {!loading && !error && visibleCount < pastSorted.length && (
          <button
            onClick={handleLoadMore}
            className="mt-6 font-bold text-black border px-6 py-2 cursor-pointer bg-white border-white px-10 py-2 rounded box font-abel-pro text-base"
          >
            LOAD MORE
          </button>
        )}
      </div>
    </MasterLayout>
  );
};

export default PastEvent;
