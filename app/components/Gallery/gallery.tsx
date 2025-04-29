"use client";

import React from "react";
import MasterLayout from "../masterlayout/master";
import Image from "next/image";
import GalleryCard from "./galleryCard";

const Gallery: React.FC = () => {
  return (
    <MasterLayout>
      <div className="relative h-[100vh] w-full overflow-hidden">
        <Image
          src="/galleryImage.avif"
          alt="Event Gallery Cover"
          fill
          className="object-cover brightness-50"
          priority
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-bold uppercase drop-shadow-lg">
              Memories That Last Forever
            </h1>
            <p className="mt-4 text-sm md:text-lg max-w-xl mx-auto drop-shadow">
              Explore the highlights of our vibrant events — from music nights to tech talks,
              and everything in between.
            </p>
          </div>
        </div>
      </div>
      <GalleryCard/>
    </MasterLayout>
  );
};

export default Gallery;
