"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <img src="/loading.gif" alt="Loading..." className="w-20 h-20 object-contain" />
    </div>
  );
};

export default Loading;
