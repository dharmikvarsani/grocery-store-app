"use client"
import Image from 'next/image';
import React from 'react';
import { TrashIcon } from 'lucide-react';

const CartItemList = ({ cartItemList = [], handleItemDelete }) => {

    return (
        <div  className='lg:h-[500px]  h-[50%]   overflow-auto' >
            {cartItemList.length > 0 ? (
                cartItemList.map((item, index) => (
                    <div key={item.id} className='flex flex-row  justify-baseline items-center' >
                        <div className="flex items-center gap-4 p-2 border-b w-[100%]">
                            <Image
                                src={item?.image} 
                                alt={item.name}
                                width={50}
                                height={50}
                                unoptimized
                                className='border-1 p-1 w-[80px] h-[80px] object-contain'
                            />
                            <div>
                                <h2 className="text-lg font-bold">{item.name}</h2>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ₹{item.actualPrice}</p>
                            </div>
                        </div>
                        <TrashIcon className='hover:text-red-500 cursor-pointer' onClick={() => { handleItemDelete(item.id); }} />
                    </div>
                ))
            ) : (
                <div>No items in the cart</div>
            )}
        </div>
    );
};

export default CartItemList;
