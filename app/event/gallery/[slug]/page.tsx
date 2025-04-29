"use client";

import React from "react";
import { useParams } from "next/navigation";
import eventsData from "@/app/components/data/eventsData";
import MasterLayout from "@/app/components/masterlayout/master";
import slugify from "@/app/utils/slugify";
import Image from "next/image";
import Photos from "@/app/components/imageSlider/photos";
import galleryData from "@/app/components/data/galleryData";

const EventgalleryPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const event = eventsData.find((item) => slugify(item.title) === slug);

  if (!event) {
    return <div className="text-white p-10">Event not found</div>;
  }

  const relatedGallery = galleryData.find(
    (gallery) => gallery.eventId === event.id
  );
  const relatedImages = relatedGallery ? relatedGallery.images : [];

  return (
    <MasterLayout>
      <div className="flex flex-col justify-center items-center bg-black pb-10 relative">
        {/* Top Banner */}
        <div className="md:h-screen h-[600px] w-full relative">
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-1/2 md:left-1/2 left-[50%]  transform -translate-x-1/2 -translate-y-1/2 px-4 z-10">
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
                📅 {event.date} | 📍 {event.venue}, {event.location}
              </p>
              <hr className="border border-gray-300 w-[50%] mx-auto" />
              <p>
                {
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s."
                }
              </p>
              <p>
                {
                  "It survived five centuries and the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s."
                }
              </p>
              <p>
                {
                  "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in classical Latin literature from 45 BC."
                }
              </p>
              <p>
                {
                  " The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested."
                }
              </p>
            </div>
          </div>
        </div>

        <Photos Images={relatedImages} />
      </div>
    </MasterLayout>
  );
};

export default EventgalleryPage;
