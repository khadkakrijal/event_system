"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MasterLayout from "@/app/components/masterlayout/master";
import slugify from "@/app/utils/slugify";
import Image from "next/image";
import Photos from "@/app/components/imageSlider/photos";
import { EventsAPI, GalleriesAPI, AlbumsAPI } from "@/app/api/apiService";
import type { Event } from "@/app/api/apiContract";
import Link from "next/link";

type PhotoItem = { image: string };

const EventGalleryPage = () => {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // data for gallery
  const [galleryImages, setGalleryImages] = useState<PhotoItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // 1) load all events once
  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.list(); // GET /events
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        console.error("Failed to load events:", e);
        setError("Failed to load event.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) find the event by slug
  const event = useMemo(
    () => events.find((e) => slugify(e.title) === slug),
    [events, slug]
  );

  // 3) redirect upcoming events to detail page
  useEffect(() => {
    if (!event) return;
    const isUpcoming = new Date(event.date).getTime() > Date.now();
    if (isUpcoming) {
      router.replace(`/event/detail/${slug}`);
    }
  }, [event, slug, router]);

  // 4) if past event, load gallery (first gallery + its images)
  useEffect(() => {
    const loadGallery = async () => {
      if (!event) return;
      const isPast = new Date(event.date).getTime() < Date.now();
      if (!isPast) return;

      try {
        setGalleryLoading(true);
        // GET /galleries?eventId=ID
        const galleries = await GalleriesAPI.list({ eventId: event.id });
        if (!galleries || galleries.length === 0) {
          setGalleryImages([]); // no gallery yet
          return;
        }

        const gallery = galleries[0]; // pick the first gallery
        // GET /albums?galleryId=ID  -> [{ id, gallery_id, image_url }]
        const albums = await AlbumsAPI.list({ galleryId: gallery.id });
        const images: PhotoItem[] = (albums || []).map((a) => ({
          image: a.image_url || "/events.jpg",
        }));
        setGalleryImages(images);
      } catch (e) {
        console.error("Failed to load gallery:", e);
        setGalleryImages([]);
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGallery();
  }, [event]);

  // ---------- render states ----------
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

  // If it’s upcoming, we’ll have redirected already. Show nothing while redirecting.
  const isUpcoming = new Date(event.date).getTime() > Date.now();
  if (isUpcoming) {
    return null;
  }

  // ---------- main UI for past event ----------
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
          <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 px-4 z-10">
            <div className="text-center text-white backdrop-blur-sm bg-black/30 rounded-md p-4 md:p-6">
              <h1 className="text-2xl md:text-4xl font-bold uppercase drop-shadow-lg tracking-wide md:w-full w-[300px]">
                Capturing the Spirit of the Moment
              </h1>
            </div>
          </div>
        </div>

        {/* Event Detail Section */}
        <div className="relative md:h-[750px] h-[700px] w-full bg-white">
          <Image
            src="/galleryImage.avif"
            alt={event.title}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
            <div className="text-black md:w-[75%] w-full font-abel text-center space-y-6">
              <h1 className="text-2xl md:text-4xl font-bold uppercase">
                {event.title}
              </h1>
              <p className="text-sm md:text-base font-medium">
                📅 {new Date(event.date).toLocaleString()} | 📍 {event.venue}
                {event.venue && event.location ? ", " : ""}{event.location}
              </p>
              <hr className="border border-gray-300 w-[50%] mx-auto" />
              <p>{event.description || "Relive moments from this event in the gallery below."}</p>
            </div>
          </div>
        </div>

        {/* Photos from Albums (first gallery) */}
        {galleryLoading ? (
          <div className="text-white py-8">Loading gallery…</div>
        ) : galleryImages.length === 0 ? (
          <div className="text-white py-8">No gallery found for this event.</div>
        ) : (
          <Photos Images={galleryImages} />
        )}
      </div>
    </MasterLayout>
  );
};

export default EventGalleryPage;
