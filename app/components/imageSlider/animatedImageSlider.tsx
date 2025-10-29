import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import classNames from "classnames";
import type { Event } from "@/app/api/apiContract";

interface MediaItem {
  type: "image" | "video";
  source: string;
}

interface AnimationimagesliderProps {
  Images: MediaItem[];
  // Use your backend Event type (snake_case featured_image)
  event?: Pick<Event, "title" | "date" | "venue" | "location" | "featured_image">;
}

const Animationimageslider: React.FC<AnimationimagesliderProps> = ({ Images, event }) => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const total = Images.length;

  const visibleImages: MediaItem[] =
    total === 0
      ? []
      : [...Images.slice(startIndex), ...Images.slice(0, startIndex)].slice(0, Math.min(5, total));

  const openLightbox = (index: number) => {
    if (total === 0) return;
    setLightboxOpen(true);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPreviousImages = (): void => {
    if (total === 0) return;
    setStartIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goToNextImages = (): void => {
    if (total === 0) return;
    setStartIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col md:gap-18 gap-2 w-full justify-center items-center bg-black md:pb-10">
      <h1 className="font-abel-pro text-white font-bold md:text-4xl p-11 text-xl">EVENTS PHOTOS</h1>

      {/* Desktop main strip */}
      <div className="hidden md:block">
        <div className="flex gap-4 justify-center items-center p-4 pb-11">
          <div className="md:flex hidden">
            {visibleImages.map((item, index) => (
              <motion.div
                key={`${startIndex}-${index}`}
                className={classNames(
                  "",
                  index === 0
                    ? "scale-100 z-10 hover:cursor-pointer w-[100px] relative opacity-25 brightness-60"
                    : "",
                  index === 1
                    ? "scale-110 z-10 hover:cursor-pointer w-[150px] relative opacity-60 brightness-40"
                    : "",
                  index === 3
                    ? "scale-110 z-10 hover:cursor-pointer relative w-[150px] opacity-60 brightness-40"
                    : "",
                  index === 4
                    ? "scale-100 z-10 hover:cursor-pointer relative w-[100px] opacity-20 brightness-60"
                    : "",
                  index === 2 ? "scale-125 z-20 hover:cursor-pointer relative" : ""
                )}
                style={{ margin: "1px" }}
              >
                <div onClick={() => openLightbox((startIndex + index) % Math.max(total, 1))}>
                  {item.type === "video" ? (
                    <video
                      src={item.source}
                      className="h-[300px] w-[400px] object-fill cursor-pointer rounded-lg border-2 border-gray-300 object-cover bg-black"
                    />
                  ) : (
                    <Image
                      width={400}
                      height={300}
                      src={item.source}
                      alt={`Image ${startIndex + index + 1}`}
                      className="h-[300px] w-[400px] cursor-pointer transition-transform 1.5s ease-in-out rounded-lg border-2 border-gray-300 object-cover bg-black"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls + thumbnails */}
      <div className="flex gap-4 justify-center items-center p-2 pb-11">
        <button onClick={goToPreviousImages} className="cursor-pointer" aria-label="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25" viewBox="0 0 18 40" fill="none">
            <path d="M0 20L17.25 0.947441V39.0526L0 20Z" fill="#D9D9D9" />
          </svg>
        </button>

        {/* Desktop thumbnails */}
        <div className="md:flex hidden gap-7">
          {visibleImages.map((item, index) => {
            const centerIndex = Math.floor(visibleImages.length / 2);
            const distance = index - centerIndex;
            let newStartIndex = startIndex;

            if (distance > 0) {
              newStartIndex = (startIndex + distance) % Math.max(total, 1);
            } else if (distance < 0) {
              newStartIndex = (startIndex + distance + Math.max(total, 1)) % Math.max(total, 1);
            }

            const isCenter = distance === 0;

            return (
              <div
                key={`thumb-${startIndex}-${index}`}
                onClick={() => setStartIndex(newStartIndex)}
                className={`cursor-pointer transition-transform 1.5s ease-in-out ${isCenter ? "" : "brightness-50"}`}
              >
                {item.type === "video" ? (
                  <video
                    src={item.source}
                    className={`h-[100px] w-[130px] object-fill ${isCenter ? "scale-125 border border-gray-300 object-cover" : ""}`}
                  />
                ) : (
                  <Image
                    width={130}
                    height={100}
                    src={item.source}
                    alt={`Thumb ${startIndex + index + 1}`}
                    className={`h-[100px] w-[130px] ${isCenter ? "scale-125 border border-gray-300 object-cover" : ""}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile thumbnails */}
        <div className="md:hidden flex gap-2">
          {visibleImages.slice(0, 6).map((item, index) => (
            <div key={`mthumb-${startIndex}-${index}`} onClick={() => openLightbox((startIndex + index) % Math.max(total, 1))}>
              {item.type === "video" ? (
                <video src={item.source} className="h-[70px] w-[70px] object-fill cursor-pointer" />
              ) : (
                <Image width={70} height={70} src={item.source} alt={`Image ${startIndex + index + 1}`} className="h-[70px] w-[70px] cursor-pointer" />
              )}
            </div>
          ))}
        </div>

        <button onClick={goToNextImages} className="cursor-pointer" aria-label="Next">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25" viewBox="0 0 18 40" fill="none">
            <path d="M18 20L0.75 39.0526V0.947441L18 20Z" fill="#D9D9D9" />
          </svg>
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && total > 0 && (
        <div className="fixed top-11 left-0 w-screen h-screen bg-black md:bg-opacity-90 flex md:items-center justify-center z-30">
          <button
            className="absolute cursor-pointer top-10 md:top-20 right-3/4 md:right-9 text-white z-50 border w-20 h-8 rounded-lg"
            onClick={closeLightbox}
          >
            Close
          </button>

          <div>
            {Images[lightboxIndex]?.type === "video" ? (
              <video
                src={Images[lightboxIndex].source}
                className="md:max-h-full md:max-w-[80vw] h-[93%] object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
                width={1200}
                height={800}
                src={Images[lightboxIndex].source}
                alt={`Image ${lightboxIndex + 1}`}
                className="md:max-h-full md:max-w-[80vw] h-[93%] object-contain"
              />
            )}

            {/* Caption overlay */}
            <div className="md:h-screen flex items-end absolute inset-0 text-white md:opacity-0 transition-opacity duration-300 md:hover:opacity-100">
              <div className="md:px-[90px] px-5 md:bg-black md:bg-opacity-80 h-[100px] w-screen flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-[16px] text-white font-medium uppercase">
                      {event?.title}
                    </h1>
                    <h1>|</h1>
                    <h1 className="text-[16px] text-white font-medium uppercase">image gallery</h1>
                  </div>
                  <h1 className="text-white text-[13px] font-light">
                    {event ? new Date(event.date).toLocaleDateString() : ""}
                  </h1>
                </div>
                <div className="md:flex hidden items-center gap-4">
                  <h1 className="text-[16px] text-white font-medium uppercase">
                    {lightboxIndex + 1}/{total}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Prev/Next in lightbox */}
          <button
            className="absolute cursor-pointer md:top-1/2 bottom-[1px] -translate-y-1/2 left-6 z-10"
            onClick={() => setLightboxIndex((prev) => (prev === 0 ? total - 1 : prev - 1))}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25" viewBox="0 0 18 40" fill="none">
              <path d="M0 20L17.25 0.947441V39.0526L0 20Z" fill="#FFFFFF" />
            </svg>
          </button>

          <div className="md:hidden absolute bottom-[10px] flex justify-center items-center gap-4">
            <h1 className="text-[20px] text-white font-medium uppercase">
              {lightboxIndex + 1}/{total}
            </h1>
          </div>

          <button
            className="absolute cursor-pointer md:top-1/2 bottom-[98px] -translate-y-1/2 right-7 z-10"
            onClick={() => setLightboxIndex((prev) => (prev === total - 1 ? 0 : prev + 1))}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="25" viewBox="0 0 18 40" fill="none">
              <path d="M18 20L0.75 39.0526V0.947441L18 20Z" fill="#FFFFFF" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Animationimageslider;
