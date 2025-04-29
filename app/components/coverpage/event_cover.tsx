import React from "react";
import Link from "next/link";
import Image from "next/image";


const EventsCover: React.FC = () => {
  return (
    <div className="z-10 relative top-0">
      <div className="bg-cover h-screen bg-center">
        <div className=" min-w-full ">
          <Image
            src="/event-collage.avif"
            alt="logo"
            layout="fill"
            objectFit="cover"
          />
         <div className="absolute inset-0 bg-black opacity-30 "></div>

        </div>
      </div>
      <div className="flex flex-col absolute inset-0 justify-center items-center text-white gap-10">
        <div className="md:text-3xl font-bold text-xl uppercase text-center flex flex-col gap-4 md:w-3/5 w-[81vw] items-center mb-[20px]">
          <p className="flex flex-wrap md:w-[48vw] font-abel-pro">
            Create, Organize & Celebrate — Events of Every Kind
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 relative">
          <Link href="/about" className="">
            <button className="box bg-white  text-black hover:cursor-pointer bg-custom-btn border-[1px] border-custom-btn font-bold  md:py-2 md:px-8 rounded md:text-lg text-sm  md:h-[3vw] md:w-[15vw] w-[60vw] h-[11vw] font-arial">
              ABOUT US
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsCover;
