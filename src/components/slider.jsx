"use client";
import { getSlider } from "@/utils/globleApi";
import React, { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const Slider = () => {
    const [slider, setSlider] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchSliders = async () => {
            const res = await getSlider();
            if (res && res.data) {
                setSlider(res.data);
            }
            setLoading(false); 
        };

        fetchSliders();
    }, []);

    if (loading) return null; 

    return (
        <div className="w-screen h-[200px] md:h-[500px] overflow-hidden">
            <Carousel className="w-full h-full">
                <CarouselContent className="flex">
                    {slider.map((sliders) => (
                        <CarouselItem key={sliders.id} className="w-full h-[500px]">
                            <div className="relative w-full h-full">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${sliders?.image[0]?.url}`}
                                    alt="Slider"
                                    layout="fill" 
                                    objectfit="fill"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600" />
            </Carousel>
        </div>
    );
};

export default Slider;
