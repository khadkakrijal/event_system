"use client";

import CoverPage from "./components/coverpage/coverPage";
import EventsCover from "./components/coverpage/event_cover";
import Calenderpage from "./components/imageSlider/eventCalendar";
import MasterLayout from "./components/masterlayout/master";
import VideoGrid from "./components/videoGrid/videogrid";

export default function Home() {
  return (
    <MasterLayout>
      <CoverPage />
      <EventsCover />
      <VideoGrid />
      <Calenderpage />
    </MasterLayout>
  );
}
