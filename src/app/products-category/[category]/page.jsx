"use client";
import { getProductByCategory, getCategory } from "@/utils/globleApi";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductList from "@/components/productList";
import { useParams } from "next/navigation";

const ProductCategory = () => {
    const params = useParams(); 
    const [productList, setProductList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(params.category); 

    useEffect(() => {
        if (selectedCategory) {
            fetchProducts(selectedCategory);
        }
        fetchCategories();
    }, [selectedCategory]);

    const fetchProducts = async (category) => {
        if (!category) return;
        try {
            const res = await getProductByCategory({ category });
            if (res && res.data) {
                setProductList(res.data);
            } else {
                setProductList([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProductList([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategory();
            if (res && res.data) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    return (
        <div className="flex flex-col justify-center gap-10">
            <h1 className="flex justify-center items-center xl:text-2xl text-xl text-white font-bold h-[50px] bg-green-500">
                {selectedCategory}
            </h1>
            <div className="flex px-5 items-center gap-4 md:justify-center lg:gap-25 overflow-auto md:gap-8 cursor-pointer">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.slug || category.name);
                                fetchProducts(category.slug || category.name);
                            }}
                            className={`bg-green-200 flex justify-center items-center flex-col gap-3 w-[120px] p-3 rounded-lg 
                                ${selectedCategory === category.name ? "border-2 border-green-600" : ""}`}
                        >
                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + category?.icon[0]?.url}
                                alt={category?.name}
                                width={50}
                                height={50}
                                unoptimized
                                className="w-[90px] object-contain hover:scale-125 transition-all ease-in-out"
                            />
                            <h3 className="font-bold text-[10px] md:text-[15px]">{category?.name}</h3>
                        </button>
                    ))
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>

            <div className="flex justify-center items-center gap-10 flex-col">
                <h1 className="font-bold xl:text-2xl text-xl text-left text-green-400">
                    All {selectedCategory} Products
                </h1>
                <ProductList products={productList} />
            </div>
        </div>
    );
};

export default ProductCategory;
