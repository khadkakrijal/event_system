"use client";

import { useParams } from "next/navigation";
import React from "react";
import eventsData from "@/app/components/data/eventsData";
import galleryData from "@/app/components/data/galleryData";
import AlbumData from "@/app/components/data/albumData";
import slugify from "@/app/utils/slugify";
import MasterLayout from "@/app/components/masterlayout/master";
import Photos from "@/app/components/imageSlider/photos";

import Image from "next/image";
import Animationimageslider from "@/app/components/imageSlider/animatedImageSlider";

const AlbumPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const event = eventsData.find((event) => slugify(event.title) === slug);
  const gallery = galleryData.find((g) => g.eventId === event?.id);
  const albumImages = AlbumData.filter((img) => img.galleryId === gallery?.id);

  const photos = event ? [{ image: event.featuredImage }] : [];

  const mediaItems =
    albumImages?.map((img) => ({
      type: "image" as const,
      source: img.image,
    })) || [];

  if (!event || !gallery) {
    return (
      <MasterLayout>
        <div className="text-white text-center mt-20">Gallery Not Found</div>
      </MasterLayout>
    );
  }

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
              <p className="text-gray-400 text-lg text-center">
                {gallery.title2}
              </p>
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
        {/* Album Gallery Slider */}
        <Animationimageslider Images={mediaItems} event={event} />
        {/* Featured Image */}
        <Photos Images={photos} />
      </div>
    </MasterLayout>
  );
};

export default AlbumPage;
