'use client'
import CategoryList from "@/components/CategoryList";
import Footer from "@/components/footer";
import PopularProduct from "@/components/popularProduct";
import Slider from "@/components/slider";
import React, { useState, useEffect } from "react";
import Loading from "./loading";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex pt-10 justify-center items-center flex-col gap-y-15 overflow-hidden">
      <Slider />
      <CategoryList />
      <PopularProduct />
      
      {/* Banner */}
      <img
        src="/banner.jpg"
        alt="Banner"
        className="lg:w-[1225px] lg:h-[450px] object-contain"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
