"use client";
import React from "react";

const VideoGrid: React.FC = () => {
  const videoSources = [
    "/video1.mp4",
    "/video2.mp4",
    "/video3.mp4",
    "/video4.mp4",
    "/video5.mp4",
    "/video6.mp4",
  ];

  return (
    <div className="relative w-full h-screen p-2 bg-slate-900">
      <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-3xl font-bold uppercase drop-shadow-lg">
            Event Highlights
          </h1>
          <p className="mt-2 text-sm md:text-xl drop-shadow">
            A glimpse of vibrant moments from our past events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full h-full">
        {videoSources.map((src, idx) => (
          <video
            key={idx}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        ))}
          <div className="absolute inset-0 bg-black opacity-30 "></div>
      </div>
    </div>
  );
};

export default VideoGrid;
