"use client"
import React, { ReactNode } from "react";
import Sidebar from "./sidebar";


interface AdminProps {
  children: ReactNode;
}

const  Admin: React.FC<AdminProps> = ({ children }) => {
  return (
    <div className="flex">
    <Sidebar/>
      <div className="w-full ml-[300px] p-5 h-screen overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default Admin;
