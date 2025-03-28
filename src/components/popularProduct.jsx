"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/utils/globleApi";
import ProductList from "./productList";

const PopularProduct = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                const res = await getProducts();
                if (res && res.data) {
                    setPopularProducts(res.data.slice(0, 8)); 
                }
            } catch (error) {
                console.error("Error fetching popular products:", error);
            }
            setLoading(false); 
        };

        fetchPopularProducts();
    }, []);

    if (loading) return null; 

    return (
        <div className="flex flex-col gap-8">
            <h1 className="font-bold text-2xl text-green-400 sm:text-start text-center">
                Our Popular Products
            </h1>
            <ProductList products={popularProducts} />
        </div>
    );
};

export default PopularProduct;
