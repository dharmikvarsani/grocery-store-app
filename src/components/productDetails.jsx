"use client"
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import { MdAddShoppingCart } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addCart } from "@/utils/globleApi";
import { LoaderCircle } from "lucide-react";
import { UpdateCartContext } from "@/app/context/cartContext";

const ProductDetails = ({ product }) => {
  const [productTotalPrice, setProductTotalPrice] = useState(product.sellingPrice ? product.sellingPrice : product.mrp);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false)
  const jwt = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"))
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext)
  const router = useRouter();

  if (!product || Object.keys(product).length === 0) {
    return <p>No Product Data Available</p>;
  }


  const addToCart = async () => {
    setLoading(true)
    if (!jwt) {
      router.push('/login');
      setLoading(false)
      return;
    }

    const data = {
      data: {
        quantity: quantity,
        amount: (quantity * productTotalPrice).toFixed(2),
        products: product.id,
        users_permissions_users: user.id,
        userId: user.id

      }
    };

    try {
      const res = await addCart(data, jwt);
      toast.success("Added to cart");
      setUpdateCart(!updateCart);
      setLoading(false);
    } catch (error) {
      console.error("Error In Add To Cart", error.response?.data || error.message);
      toast.error("Error while adding into cart");
      setLoading(false)
    }
  };



  return (
    <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 sm:p-7 p-5 bg-white text-black">
      <Image
        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.image?.url}
        alt={product.name} width={200} height={230} unoptimized
        className=" sm:w-[200px] sm:h-[230px] w-[150px] h-[130px] flex  p-2 shadow-lg bg-slate-200 rounded-lg object-contain"
      />
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-lg  sm:text-2xl" >{product?.name}</h1>
        <p className="font-bold text-xs text-gray-400" >{product?.description || "No description available."}</p>
        <div className="flex gap-3 font-bold">
          {product?.sellingPrice && <h1>₹{product.sellingPrice}</h1>}
          {product?.mrp && (
            <h2 className={`${product.sellingPrice ? "line-through text-gray-500" : ""}`}>
              ₹{product.mrp}
            </h2>
          )}
          <h2 className="font-bold text-md" >Quantity ({product?.itemQuantityType})</h2>
        </div>
        <div className="flex flex-row items-center gap-3" >
          <div className="flex flex-row gap-4  font-bold text-xl border-1 w-[100px] h-[40px] justify-center rounded-md items-center" >
            <button
              disabled={quantity === 1}
              className={`w-7 h-7 flex items-center justify-center rounded-md ${quantity === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
              onClick={() => setQuantity(quantity - 1)} >
              -
            </button>
            <h1>{quantity}</h1>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200"
            >
              +
            </button>
          </div>
          <h2 className="font-bold text-lg" ><span className="pr-2">=</span>₹{(quantity * productTotalPrice).toFixed(2)}</h2>
        </div>
        <div>

          <Button disabled={loading} onClick={() => addToCart()} variant="outline" className='text-green-400 hover:bg-green-500 font-bold hover:text-white  w-[120px]'>
            <MdAddShoppingCart />
            {loading ? <LoaderCircle className="animate-spin" /> : 'Add to cart'}
          </Button>

        </div>
      </div>
    </div>
  );
};



export default ProductDetails;










{/* <p className="text-gray-700">{product?.description || "No description available."}</p>

</div> */}