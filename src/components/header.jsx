"use client"
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LuLayoutGrid } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { Button } from './ui/button';
import { deleteCartItem, getCartProduct, getCategory } from '@/utils/globleApi';
import Link from 'next/link';
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { UpdateCartContext } from '@/app/context/cartContext';
import { ShoppingBasket } from 'lucide-react';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import CartItemList from './cartItemList';
import { toast } from 'sonner';


const Header = () => {

    const [categories, setCategories] = useState([])
    const [productCount, setProductCount] = useState(0)
    const [cartItemList, setCartItemList] = useState([])
    const [subTotal, setSubTotal] = useState(0)
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const { updateCart, setUpdateCart } = useContext(UpdateCartContext);

    useEffect(() => {
        categorieList();
    }, [])

    useEffect(() => {
        if (user && jwt) {
            getCartItem();
        }
    }, [user, jwt, updateCart]);

    const categorieList = async () => {
        const res = await getCategory()
        if (res && res.data) {
            setCategories(res.data)
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = sessionStorage.getItem("token");
            setIsLogin(!!token);
            setJwt(token);
            setUser(JSON.parse(sessionStorage.getItem("user")) || null);
        }
    }, []);

    const onLogOut = () => {
        if (typeof window !== "undefined") {
            sessionStorage.clear();
        }
        router.push("/login");
    };


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

    const handleItemDelete = async (id) => {
        try {
            const success = await deleteCartItem(id, jwt);
            if (success) {
                toast.success("Item deleted!");
                setCartItemList(cartItemList.filter(item => item.id !== id));
                setProductCount(prevCount => prevCount - 1);
            } else {
                toast.error("Failed to delete item!");
            }
        } catch (error) {
            console.error("Error in delete cart item:", error);
            toast.error("Failed to delete item!");
        }
    };



    useEffect(() => {
        let total = 0
        cartItemList.forEach((e) => {
            total = total + e.amount
        })
        setSubTotal(total.toFixed(2))
    }, [cartItemList])



    return (
        <div className='flex flex-row  justify-around items-center shadow-lg h-[60px] pt-2.5 pb-2' >
            <div onClick={() => router.push('/')} className='flex flex-row items-center gap-2 cursor-pointer' >
                <Image src={'/logo.png'} width={39} height={39} alt='logo' />
                <h2 className='font-bold text-[21px] text-[#3BB77E]' >FreshKart</h2>
            </div>
            <div className='md:flex flex-row gap-5 cursor-pointer hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className='flex flex-row items-center gap-1 font-bold text-[15px]'> <LuLayoutGrid /> All Categories</h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {
                            categories.length > 0 ? (
                                categories.map((categorie) => (
                                    <DropdownMenuItem key={categorie.id} className='cursor-pointer flex flex-row gap-2 items-center' >
                                        <Image
                                            // src={
                                            //     process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                                            //     categorie?.icon[0]?.url} alt={categorie?.name} width={34} height={34} unoptimized 
                                            src={
                                                categorie?.icon && Array.isArray(categorie.icon) && categorie.icon.length > 0
                                                    ? (categorie.icon[0].url.startsWith("http")
                                                        ? categorie.icon[0].url
                                                        : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${categorie.icon[0].url}`)
                                                    : "/fallback-image.png"
                                            }
                                            alt={categories?.name || "Category Image"}
                                            width={34}
                                            height={34}
                                            unoptimized
                                        />
                                        <h2 className='font-semibold' >{categorie?.name}</h2>
                                    </DropdownMenuItem>
                                ))
                            ) :
                                (
                                    <DropdownMenuItem>Loading...</DropdownMenuItem>
                                )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='flex flex-row items-center gap-3 text-[14px] bg-[#f3f3f3] ps-2 rounded-sm' >
                    <IoSearch />
                    <input type="text" placeholder='Search for items...' />
                </div>
            </div>

            <div className='flex flex-row justify-center gap-5 items-center'>
                <Sheet className='absolute z-50'>
                    <SheetTrigger>
                        <div className='text-2xl flex flex-row  items-center gap-2 ' >
                            <ShoppingBasket />
                            <h2 className='bg-green-600  text-lg font-bold rounded-full h-7 w-7 text-white text-center' > {productCount}</h2>
                        </div>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className='bg-[#00a63e] text-center text-xl font-bold text-white p-2' >My Cart</SheetTitle>
                            <SheetDescription asChild={true}>
                                <div>
                                    <CartItemList cartItemList={cartItemList} handleItemDelete={handleItemDelete} />
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                        <SheetClose asChild={true} >
                            <div className='absolute w-[100%] px-5 bottom-0 flex  flex-col gap-2 mb-3'>
                                <h2 className='flex justify-between font-bold text-[17px] items-center'>SubTotal : <span>₹{subTotal}</span></h2>
                                <Button onClick={() => router.push(jwt ? '/checkout' : '/login')} className='bg-[#00a63e] hover:bg-[#09672b] '>Checkout</Button>
                            </div>
                        </SheetClose>
                    </SheetContent>
                </Sheet>

                {!isLogin ? <Link href={"/login"}>
                    <Button className='bg-[#3bb77e] hover:bg-[#3bb77dc8]'>Login</Button>
                </Link> :
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <FaRegUserCircle className='w-9 h-9 text-white bg-[#3bb77e] p-1 rounded-full' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={onLogOut}>Log-Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                }
            </div>

        </div >
    )
}

export default Header
