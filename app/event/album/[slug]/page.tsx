"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import MasterLayout from "@/app/components/masterlayout/master";
import slugify from "@/app/utils/slugify";
import Image from "next/image";
import Animationimageslider from "@/app/components/imageSlider/animatedImageSlider";
import Photos from "@/app/components/imageSlider/photos";
import { EventsAPI, GalleriesAPI, AlbumsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";

type MediaItem = { type: "image"; source: string };

const AlbumPage = () => {
  const { slug } = useParams() as { slug: string };

  const [events, setEvents] = useState<Event[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) load all events
  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list(); // GET /events
        setEvents(data || []);
      } catch (e) {
        console.error("Failed to load events:", e);
        setError("Failed to load album.");
      }
    })();
  }, []);

  // 2) find event by slug
  const event = useMemo(
    () => events.find((e) => slugify(e.title) === slug),
    [events, slug]
  );

  // 3) load gallery + albums for this event
  useEffect(() => {
    const loadAlbums = async () => {
      if (!event) return;
      try {
        setLoading(true);
        const galleries = await GalleriesAPI.list({ eventId: event.id });
        if (!galleries || galleries.length === 0) {
          setMediaItems([]);
          return;
        }
        // For now: pick the first gallery
        const gallery = galleries[0];
        const albums = await AlbumsAPI.list({ galleryId: gallery.id });
        const media = (albums || []).map((a) => ({
          type: "image" as const,
          source: a.image_url || "/events.jpg",
        }));
        setMediaItems(media);
        setError(null);
      } catch (e) {
        console.error("Failed to load albums:", e);
        setError("Failed to load album.");
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadAlbums();
  }, [event]);

  // ---------- render ----------
  if (loading) {
    return (
      <MasterLayout>
        <div className="text-white text-center mt-20">Loading album…</div>
      </MasterLayout>
    );
  }

  if (error) {
    return (
      <MasterLayout>
        <div className="text-red-400 text-center mt-20">{error}</div>
      </MasterLayout>
    );
  }

  if (!event) {
    return (
      <MasterLayout>
        <div className="text-white text-center mt-20">Event not found</div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="flex flex-col justify-center items-center bg-black pb-10 relative">
        {/* Top Banner */}
        <div className="md:h-screen h-[600px] w-full relative">
          <Image
            src={event.featured_image || "/events.jpg"}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Event Description */}
        <div className="relative md:h-[750px] h-[800px] w-full bg-white">
          <Image
            src="/galleryImage.avif"
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
                {event.venue && event.location ? ", " : ""}{event.location}
              </p>
              <hr className="border border-gray-300 w-[50%] mx-auto" />
              <p>{event.description || "Browse the event album below."}</p>
            </div>
          </div>
        </div>

        {/* Album Gallery Slider */}
        {mediaItems.length > 0 ? (
          <Animationimageslider Images={mediaItems} event={event} />
        ) : (
          <div className="text-white py-10">No album found for this event.</div>
        )}

        {/* Featured Image (single) */}
        <Photos Images={[{ image: event.featured_image || "/events.jpg" }]} />
      </div>
    </MasterLayout>
  );
};

export default AlbumPage;
