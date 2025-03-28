"use client";
import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductDetails from './productDetails';
import Image from 'next/image';
import { DialogDescription } from '@radix-ui/react-dialog';

const ProductList = ({ products = [] }) => {
    return (
        <div className='flex flex-col gap-10'>
            {/* <h1 className='font-bold text-2xl text-green-400'>Our Popular Products</h1> */}
            <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8.5 gap-y-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className='bg-white shadow-lg xl:w-[280px] w-[230px] h-auto py-5 flex flex-col xl:gap-5 gap-2 justify-center items-center rounded-lg border-1 border-zinc-300 hover:scale-110 hover:shadow-md transition-all ease-in-out'>
                            <Image
                                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product?.image?.url}
                                alt={product.name}
                                width={200}
                                height={190}
                                unoptimized
                                className='xl:w-[200px] xl:h-[190px] h-[120px] w-[150px] object-contain'
                            />
                            <div className='flex flex-col justify-center items-center gap-2 font-bold'>
                                <h2>{product?.name}</h2>
                                <div className='flex gap-3'>
                                    {product?.sellingPrice && <h1>₹{product.sellingPrice}</h1>}
                                    {product?.mrp && (
                                        <h2 className={`${product.sellingPrice ? "line-through text-gray-500" : ""}`}>
                                            ₹{product.mrp}
                                        </h2>
                                    )}
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className='text-green-400 hover:bg-green-500 hover:text-white'>Add to cart</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Product Details</DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription>
                                            <div>
                                                <ProductDetails product={product} />
                                            </div>
                                        </DialogDescription>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center'>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
