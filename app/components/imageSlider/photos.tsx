import React, { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

interface Image {
  image: string;
}
interface PhotosProps {
  Images: Image[];
}

const Photos: React.FC<PhotosProps> = ({ Images }) => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const visibleImages: Image[] = [
    ...Images.slice(startIndex),
    ...Images.slice(0, startIndex),
  ].slice(0, 3);
  const goToPreviousImages = (): void => {
    setStartIndex((prevStartIndex) =>
      prevStartIndex === 0 ? Images.length - 1 : prevStartIndex - 1
    );
  };
  const goToNextImages = useCallback(() => {
    setStartIndex((prevStartIndex) =>
      prevStartIndex === Images.length - 1 ? 0 : prevStartIndex + 1
    );
  }, [Images.length]);
  

 
  
  useEffect(() => {
    const intervalId = setInterval(goToNextImages, 4000);
    return () => clearInterval(intervalId);
  }, [goToNextImages]);
  

  return (
    <div className="flex flex-col md:gap-20 gap-10  justify-center items-center md:bg-cover bg:black pt-10 pb-10">
      <div className="flex justify-around w-full ">
        {Images.length > 1 && (
          <button onClick={goToPreviousImages} className="md:hidden block">
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
        )}
        <h1 className="text-white md:text-4xl text-xl font-bold font-abel-pro mt-0">
          PHOTOS
        </h1>
        {Images.length > 1 && (
          <button onClick={goToNextImages} className="md:hidden block">
            {" "}
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
        )}
      </div>
      <div className="flex gap-5   justify-center items-center  ">
        {Images.length > 1 && (
          <button
            onClick={goToPreviousImages}
            className="md:block hidden cursor-pointer"
          >
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
        )}
        <div className="md:flex gap-16 hidden">
          {visibleImages.map((image, index) => (
            <motion.div
              key={`${image.image}-${index}`}
              className={classNames(
                "transform transition-transform ease-in-out   duration-300",
                index === 0 ? " " : index === 2 ? "" : "",
                index === 1
                  ? "scale-125 hover:scale-150 z-10 hover:cursor-pointer"
                  : ""
              )}
            >
              <motion.img
                src={image.image}
                alt={`Image ${startIndex + index + 1}`}
                initial={{ opacity: 0, x: index === 1 ? 50 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: index === 1 ? -50 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={classNames(
                  "h-[250px] w-[250px] rounded object-cover",
                  ""
                )}
              />
            </motion.div>
          ))}
        </div>

        <div className="md:hidden  flex gap-12">
          {visibleImages.map((image, index) => (
            <motion.div
              key={`${image.image}-${index}`}
              className={classNames(
                "transform transition-transform ease-in-out   duration-1000",
                index === 0 ? " " : index === 2 ? "" : "",
                index === 1
                  ? "scale-125 hover:scale-150 z-10  w-96 hover:cursor-pointer"
                  : ""
              )}
            >
              <motion.img
                src={image.image}
                alt={`Image ${startIndex + index + 1}`}
                initial={{ opacity: 0, x: index === 1 ? 50 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: index === 1 ? -50 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={classNames(
                  "h-[200px] w-[200px] object-cover rounded"
                )}
              />
            </motion.div>
          ))}
        </div>

        {Images.length > 1 && (
          <button
            onClick={goToNextImages}
            className="md:block hidden cursor-pointer"
          >
            {" "}
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
        )}
      </div>
    </div>
  );
};
export default Photos;
