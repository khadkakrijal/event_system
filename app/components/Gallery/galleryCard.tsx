"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoFilter } from "react-icons/io5";
import slugify from "@/app/utils/slugify";
import Image from "next/image";
import { EventsAPI, GalleriesAPI, AlbumsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

interface GalleryEvent extends Event {
  galleryImages: { image: string }[];
}

const GalleryCard: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleViewMode = () =>
    setViewMode(viewMode === "horizontal" ? "vertical" : "horizontal");

  // 🔹 Load past events and galleries
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const events = await EventsAPI.list({ mode: "past" });

        const merged: GalleryEvent[] = [];

        for (const event of events) {
          const galleries = await GalleriesAPI.list({ eventId: event.id });
          if (galleries && galleries.length > 0) {
            const albums = await AlbumsAPI.list({ galleryId: galleries[0].id });
            const images = (albums || []).map((a) => ({
              image: a.image_url || "/events.jpg",
            }));
            merged.push({ ...event, galleryImages: images });
          } else {
            merged.push({ ...event, galleryImages: [] });
          }
        }

        setGalleryEvents(merged);
        setError(null);
      } catch (e) {
        console.error("Failed to load galleries:", e);
        setError("Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visibleEvents = galleryEvents.slice(0, visibleCount);

  return (
    <div className="bg-black flex flex-col gap-12 justify-center items-center z-10 pt-11">
      {/* Top filter UI */}
      <div className="md:hidden flex gap-">
        <div className="border border-gray-600 w-[85vw] h-[8vw] rounded flex text-white text-[15px] justify-center">
          <button className="w-[50%]">RECENT</button>
          <button className="w-[50%] border-x border-gray-600">PAST</button>
          <button className="w-[50%]">MOST VIEWED</button>
        </div>
        <button>
          <IoFilter className="h-5 w-6" />
        </button>
      </div>

      <div className="bg-black flex justify-between items-center md:w-[78vw]">
        <div></div>
        <p className="text-white text-center md:text-[40px] text-[30px] font-semibold uppercase flex justify-center">
          Gallery
        </p>
        <button
          className="md:hidden cursor-pointer p-2"
          onClick={toggleViewMode}
        ></button>
        <div>
          <button
            className="text-white text-[18px] border border-white py-2 pl-12 pr-6 rounded-md hidden md:flex md:justify-center  md:items-center font-abel-pro"
            onClick={toggleDropdown}
          >
            FILTER
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="12"
              viewBox="0 0 28 14"
              fill="none"
              className="ml-2"
            >
              <path d="M14 14L0.143595 0.5L27.8564 0.5L14 14Z" fill="#D9D9D9" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-black text-white text-[18px] py-2 px-12 border border-white rounded-md hidden md:flex font-abel-pro z-50">
              <ul>
                <li>Newest</li>
                <li>Location</li>
                <li>Artist</li>
                <li>Oldest</li>
                <li>Date</li>
                <li>Most Viewed</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* GALLERY GRID */}
      <div
        className={`bg-black ${
          viewMode === "horizontal"
            ? "flex flex-row overflow-x-auto scrollbar-hide"
            : "md:grid md:grid-cols-3"
        } gap-7`}
      >
        {loading && <p className="text-white">Loading galleries…</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading &&
          !error &&
          visibleEvents.map((event) => (
            <Link key={event.id} href={`/event/album/${slugify(event.title)}`}>
              <div className="rounded-lg h-fit md:w-[25vw] space-y-3 xs:w-[72vw] sm:w-[72vw] bg-cover hover:bg-custom-gray p-2 cursor-pointer">
                <Image
                  height={100}
                  width={100}
                  src={event.galleryImages[0]?.image || "/events.jpg"}
                  alt={event.title}
                  className="rounded-lg md:w-[24vw] md:h-[24vw] xs:h-[70vw] xs:w-[70vw] sm:w-[70vw] sm:h-[70vw] object-cover"
                />
                <div className="md:flex flex-col items-center justify-center text-white text-center">
                  <p className="text-[24px] line-clamp-2 font-semibold md:w-[24vw] sm:w-[65vw] xs:w-[65vw]">
                    {event.title}
                  </p>
                  <h2 className="font-light">
                    {event.venue + ", " + event.location}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {galleryEvents.length > visibleCount && (
        <div className="flex justify-center w-full p-11">
          <div className="relative">
            <button
              onClick={() => setVisibleCount(visibleCount + 6)}
              className="hover:cursor-pointer font-bold text-white border md:h-[60px] md:w-[18vw] w-[66vw] h-[11.6vw] bg-black border-white px-10 py-2 md:text-[20px] rounded box font-abel-pro text-sm"
            >
              LOAD MORE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryCard;
