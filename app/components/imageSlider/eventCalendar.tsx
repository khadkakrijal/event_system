import React from "react";
import EventCalender from "./dateSlider";
import EventCard from "./Card";

const calenderdata = [
  {
    title: "Jan",
    title2: "3 Events",
  },
  {
    title: "Feb",
    title2: "3 Events",
  },
  {
    title: "Mar",
    title2: "3 Events",
  },
  {
    title: "Apr",
    title2: "3 Events",
  },
  {
    title: "May",
    title2: "3 Events",
  },
  {
    title: "Jun",
    title2: "3 Events",
  },
  {
    title: "Jul",
    title2: "3 Events",
  },
  {
    title: "Aug",
    title2: "3 Events",
  },
  {
    title: "Sep",
    title2: "3 Events",
  },
  {
    title: "OCt",
    title2: "3 Events",
  },
  {
    title: "Nov",
    title2: "3 Events",
  },
  {
    title: "Dec",
    title2: "3 Events",
  },
];

const cardsData = [
  { title: "Card 1", imageSrc: "/events.jpg" },
  { title: "Card 2", imageSrc: "/event-collage.avif" },
  { title: "Card 3", imageSrc: "/galleryImage.avif" },
  { title: "Card 4", imageSrc: "/events.jpg" },
  { title: "Card 1", imageSrc: "/galleryImage.avif" },
  { title: "Card 2", imageSrc: "/event-collage.avif" },
  { title: "Card 3", imageSrc: "/events.jpg" },
  { title: "Card 4", imageSrc: "/galleryImage.avif" },
];

const Calenderpage = () => {
  return (
    <div className="bg-black ">
      <EventCalender data={calenderdata} />
      <EventCard cardsData={cardsData} />
    </div>
  );
};

export default Calenderpage;
