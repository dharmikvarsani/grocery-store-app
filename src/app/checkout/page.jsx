'use client'
import { Input } from '@/components/ui/input'
import {  createOrder, deleteCartItem, getCartProduct } from '@/utils/globleApi';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const CheckOut = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const jwt = sessionStorage.getItem('token')
    const [productCount, setProductCount] = useState(0)
    const [cartItemList, setCartItemList] = useState([])
    const [subTotal, setSubTotal] = useState(0)
    const router = useRouter()

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [zip, setZip] = useState()
    const [address, setAddress] = useState()

    useEffect(() => {
        if (user && jwt) {
            getCartItem();
        }
        if (!jwt) {
            router.push('/login')
        }
    }, [user, jwt]);

    useEffect(() => {
        let total = 0
        cartItemList.forEach((e) => {
            total = total + e.amount
        })
        setSubTotal(total.toFixed(2))
    }, [cartItemList])

    const getCartItem = async () => {
        if (!user?.id || !jwt) return;

        try {
            const res = await getCartProduct(user.id, jwt);
            if (Array.isArray(res)) {
                setProductCount(res.length);
                setCartItemList(res);
            } else {
                setProductCount(0);
                setCartItemList([]);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setProductCount(0);
        }
    };

    const totalAmount = () => {
        const tax = subTotal * 0.07;
        const deliveryFee = 50;
        const amount = parseFloat(subTotal) + tax + deliveryFee;
        return amount.toFixed(2);
    };


    


    const onApprove = async (data) => {
        const payload = {
            data: {
                paymentId: data.paymentId?.toString() || "N/A",
                totalOrderAmount: parseFloat(totalAmount()),
                username: username || "N/A",
                email: email || "N/A",
                phone: phone || "N/A",
                zip: zip || "N/A",
                address: address || "N/A",
                userId: user.id,
                orderItemList: cartItemList.map(item => ({
                    product: item.product.id,  // ✅ Send only product ID
                    quantity: item.quantity,
                    amount: item.amount
                }))
            }
        };
        
        try {
            const res = await createOrder(payload, jwt);
            await Promise.all(cartItemList.map(async (item) => {
                await deleteCartItem(item.id, jwt);
            }));
            setCartItemList([]);
            setProductCount(0);
            setSubTotal(0);
            toast.success("Order placed successfully!");
            router.replace('/order-confirmation');
            router.refresh()
        } catch (error) {
            console.error("Error submitting order to Strapi:", error.response?.data || error.message);
            toast.error("Error in placing order!");
        }
    };
    


    return (
        <div>
            <h2 className='bg-[#3bb77e] text-center text-2xl text-white font-bold p-2'>Checkout</h2>
            <div className='p-5 px-5 md:px-10 grid grid-cols-1 gap-5 md:grid-cols-3 py-8'>
                <div className='md:col-span-2 md:mx-20 mx-10'>
                    <h2 className='font-bold text-lg md:text-2xl'>Billing Details</h2>
                    <p className='text-xs font-bold text-red-600'>*All fields are mandatory for place a order</p>
                    <div className='grid md:grid-cols-2 gap-3 mt-3'>
                        <Input required placeholder='Name' onChange={(e) => setUsername(e.target.value)} />
                        <Input required type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='grid md:grid-cols-2 gap-3 mt-3'>
                        <Input required placeholder='Phone' type='number' onChange={(e) => setPhone(e.target.value)} />
                        <Input required placeholder='Zip' onChange={(e) => setZip(e.target.value)} />
                    </div>
                    <div className=' mt-3'>
                        <Input required placeholder='Address' onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                <div className='mx-10 border'>
                    <h2 className='p-3 bg-gray-200 font-bold text-center'>Total Cart ({productCount})</h2>
                    <div className='flex flex-col gap-4 p-4'>
                        <h2 className='font-bold flex  justify-between'>Subtotal: <span>₹{subTotal}</span></h2>
                        <hr />
                        <h2 className='flex justify-between'>Delivery: <span>₹50</span></h2>
                        <h2 className='flex justify-between'>Tax (7%): <span>₹{(subTotal * 0.07).toFixed(2)}</span></h2>
                        <hr />
                        <h2 className='flex justify-between font-bold'>Total: <span>₹{totalAmount()}</span></h2>
                        <PayPalButtons style={{ layout: "horizontal" }}
                            disabled={!(username, email, zip, address)}
                            onApprove={onApprove}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: totalAmount(),
                                                currency_code: 'USD'
                                            }
                                        }
                                    ]
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckOut
