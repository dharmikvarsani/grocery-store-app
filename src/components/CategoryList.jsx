"use client";
import { getCategory } from "@/utils/globleApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CategoryList = () => {
    const [categorie, setCategorie] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const categorieList = async () => {
            const res = await getCategory();
            if (res && res.data) {
                setCategorie(res.data);
            }
            setLoading(false);
        };

        categorieList();
    }, []);

    if (loading) return null; // Hide component until loaded

    return (
        <div className="flex flex-col gap-8 font-bold text-2xl">
            <h1 className="text-green-400 sm:text-start text-center">Shop By Category</h1>
            <div className="grid sm:grid-cols-3 sm:gap-x-17 grid-cols-2 gap-x-10 gap-y-7 lg:grid-cols-6 lg:gap-25 md:grid-cols-4 md:gap-x-23 cursor-pointer">
                {categorie.map((categories) => (
                    <Link href={"/products-category/" + categories.name} key={categories.id} className="bg-green-200 flex justify-center items-center flex-col gap-3 w-[120px] p-3 rounded-lg">
                        <Image
                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + categories?.icon[0]?.url}
                            alt={categories?.name}
                            width={50}
                            height={50}
                            unoptimized
                            className="w-[80px] object-contain hover:scale-125 transition-all ease-in-out"
                        />
                        <h3 className="font-bold text-[15px]">{categories?.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
