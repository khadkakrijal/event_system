import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import classNames from "classnames";

interface MediaItem {
  type: "image" | "video";
  source: string;
}

interface AnimationimagesliderProps {
  Images: MediaItem[];
  event?: {
    title: string;
    date: string;
    venue: string;
    location: string;
    featuredImage: string;
  };
}

const Animationimageslider: React.FC<AnimationimagesliderProps> = ({
  Images,
  event,
}) => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const visibleImages: MediaItem[] = [
    ...Images.slice(startIndex),
    ...Images.slice(0, startIndex),
  ].slice(0, 5);

  const openLightbox = (index: number) => {
    setLightboxOpen(true);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPreviousImages = (): void => {
    setStartIndex((prevStartIndex) =>
      prevStartIndex === 0 ? Images.length - 1 : prevStartIndex - 1
    );
  };

  const goToNextImages = (): void => {
    setStartIndex((prevStartIndex) =>
      prevStartIndex === Images.length - 1 ? 0 : prevStartIndex + 1
    );
  };

  // const handleClickImage = (index: number) => {
  //   openLightbox(index);
  //   setLightboxIndex(index);
  // };

  // useEffect(() => {
  //   if (!lightboxOpen) {
  //     const intervalId = setInterval(goToNextImages, 2000);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [lightboxOpen]);

  return (
    <div className="flex flex-col md:gap-18 gap-2  w-full justify-center items-center bg-black md:pb-10">
      <h1 className="font-abel-pro text-white font-bold md:text-4xl p-11 text-xl">
        EVENTS PHOTOS
      </h1>
      <div className="hidden md:block">
        <div className="flex gap-4 justify-center items-center p-4 pb-11">
          <div className="md:flex hidden ">
            {visibleImages.map((item, index) => (
              <motion.div
                key={index}
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
                  index === 2
                    ? "scale-125 z-20 hover:cursor-pointer relative"
                    : ""
                )}
                style={{ margin: "1px" }}
              >
                <div
                  key={index}
                  onClick={() =>
                    openLightbox((startIndex + index) % Images.length)
                  }
                >
                  {item.type === "video" ? (
                    <video
                      src={item.source}
                      className="h-[300px] w-[400px] object-fill cursor-pointer rounded-lg border-2 border-gray-300 object-cover bg-black"
                    />
                  ) : (
                    <Image
                    width={100}
                    height={100}
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

      <div className="flex gap-4 justify-center items-center p-2 pb-11">
        <button onClick={goToPreviousImages} className="cursor-pointer">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="25"
            viewBox="0 0 18 40"
            fill="none"
          >
            <path
              d="M2.62347e-07 20L17.25 0.947441L17.25 39.0526L2.62347e-07 20Z"
              fill="#D9D9D9"
            />
          </svg>
        </button>
        <div className="md:flex hidden gap-7">
          {visibleImages.map((item, index) => {
            // const clickedIndex = (startIndex + index) % Images.length;
            const centerIndex = Math.floor(visibleImages.length / 2);
            const distance =
              (index - centerIndex + Images.length) % Images.length;
            let newStartIndex = startIndex;

            if (distance > 0) {
              newStartIndex = (startIndex + distance) % Images.length;
            } else if (distance < 0) {
              newStartIndex =
                (startIndex + distance + Images.length) % Images.length;
            }

            const isCenter = distance === 0;

            return (
              <div
                key={index}
                onClick={() => {
                  setStartIndex(newStartIndex);
                }}
                className={`cursor-pointer transition-transform 1.5s ease-in-out ${
                  isCenter ? "" : "brightness-50"
                }`}
              >
                {item.type === "video" ? (
                  <video
                    src={item.source}
                    className={`h-[100px] w-[130px] object-fill ${
                      isCenter
                        ? "scale-125 border border-gray-300 object-cover"
                        : ""
                    }`}
                  />
                ) : (
                  <Image
                  width={100}
                  height={100}
                    src={item.source}
                    alt={`Image ${startIndex + index + 1}`}
                    className={`h-[100px] w-[130px] ${
                      isCenter
                        ? "scale-125 border border-gray-300 object-cover"
                        : ""
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="md:hidden flex gap-2">
          {visibleImages.slice(0, 6).map((item, index) => (
            <div
              key={index}
              onClick={() => openLightbox((startIndex + index) % Images.length)}
            >
              {item.type === "video" ? (
                <video
                  src={item.source}
                  className="h-[70px] w-[70px] object-fill cursor-pointer "
                />
              ) : (
                <Image
                width={100}
                height={100}
                  src={item.source}
                  alt={`Image ${startIndex + index + 1}`}
                  className="h-[70px] w-[70px] cursor-pointer "
                />
              )}
            </div>
          ))}
        </div>

        <button onClick={goToNextImages} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="25"
            viewBox="0 0 18 40"
            fill="none"
          >
            <path
              d="M18 20L0.750002 39.0526L0.750002 0.947441L18 20Z"
              fill="#D9D9D9"
            />
          </svg>
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed top-11 left-0 z-10 w-screen h-screen bg-black bg  md:bg-opacity-90 flex space-y-24 md:items-center justify-center z-30">
          <button
            className="absolute cursor-pointer top-10 md:top-20 right-3/4 md:right-9 text-white z-50 border w-20 h-8 rounded-lg"
            onClick={closeLightbox}
          >
            Close
          </button>
          <div className="">
            {Images[lightboxIndex]?.type === "video" ? (
              <video
                src={Images[lightboxIndex].source}
                className="md:max-h-full md:max-w-[80vw] h-[93%]  object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
              width={100}
              height={100}
                src={Images[lightboxIndex]?.source}
                alt={`Image ${lightboxIndex + 1}`}
                className="md:max-h-full md:max-w-[80vw] h-[93%]  object-contain"
              />
            )}

            <div className="md:h-screen  flex items-end bg-transparent absolute md:top-0 bottom-[140px] left-0 w-screen   text-white md:opacity-0 transition-opacity duration-300  md:hover:opacity-100">
              <div className="md:px-[90px] px-5 md:bg-black bg-cover md:bg-opacity-80 h-[100px] w-screen  flex justify-between items-center ">
                <div>
                  <div className="flex justify-center items-center gap-4">
                    <h1 className="text-[16px] text-white font-medium uppercase">
                      {event?.title}
                    </h1>
                    <h1>|</h1>
                    <h1 className="text-[16px] text-white font-medium uppercase">
                      {" "}
                      image gallery{" "}
                    </h1>
                  </div>
                  <h1 className="text-white text-[13px] font-light">
                    July 22, 2022
                  </h1>
                </div>
                <div className=" md:flex  hidden justify-center items-center gap-4 ">
                  <h1 className="text-[16px] text-white font-medium uppercase">
                    {lightboxIndex + 1}/{Images.length}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div></div>
          <button
            className="absolute cursor-pointer  md:top-1/2  bottom-[1px] transform -translate-y-1/2 left-6 z-10"
            onClick={() => {
              setLightboxIndex((prevIndex) =>
                prevIndex === 0 ? Images.length - 1 : prevIndex - 1
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="25"
              viewBox="0 0 18 40"
              fill="none"
            >
              <path
                d="M2.62347e-07 20L17.25 0.947441L17.25 39.0526L2.62347e-07 20Z"
                fill="#FFFFFF"
              />
            </svg>
          </button>
          <div className="md:hidden  absolute bottom-[10px] flex   justify-center items-center gap-4">
            <h1 className="text-[20px] text-white font-medium uppercase">
              {lightboxIndex + 1}/{Images.length}
            </h1>
          </div>

          <button
            className="absolute cursor-pointer md:top-1/2 bottom-[98px] transform -translate-y-1/2 right-7 z-10"
            onClick={() => {
              setLightboxIndex((prevIndex) =>
                prevIndex === Images.length - 1 ? 0 : prevIndex + 1
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="25"
              viewBox="0 0 18 40"
              fill="none"
            >
              <path
                d="M18 20L0.750002 39.0526L0.750002 0.947441L18 20Z"
                fill="#FFFFFF"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Animationimageslider;
