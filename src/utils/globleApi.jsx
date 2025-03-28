import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:1337/api"
})

export const getCategory = async () => {
    try {
        const res = await axiosClient.get("/categories?populate=*")
        // console.log(res.data)
        return res.data;
    } catch (error) {
        console.log("Error in fetch category", error)
        return null;
    }
}


export const getSlider = async () => {
    console.log("Slider")
    try {
        const res = await axiosClient.get("/sliders?populate=*")
        // console.log('data', res.data)
        return res.data;
    } catch (error) {
        console.log("Slider Error", error)
        return null;
    }
}


export const getProducts = async () => {
    try {
        const res = await axiosClient.get("/products?populate=*")
        return res.data;
    } catch (error) {
        console.log("Error in fetching products", error)
        return null;
    }
}

export const getProductByCategory = async ({ category }) => {
    try {
        const res = await axiosClient.get("/products?filters[categories][name][$in]=" + category + "&populate=*")
        return res.data
    } catch (error) {
        console.log("Error In fetch Product By Category", error)
    }
}

export const registerUser = async (username, email, password) => {
    return await axiosClient.post("/auth/local/register", {
        username: username,
        email: email,
        password: password,
    })
}

export const LogIn = async (email, password) => {
    return await axiosClient.post("/auth/local", {
        identifier: email,
        password: password
    })
}

export const addCart = async (data, jwt) => {
    try {
        const res = await axiosClient.post("/user-carts", data, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        console.log('user carts', res.data)
        return res.data;
    } catch (error) {
        console.error("Error in addCart API:", error.response?.data || error.message);
    }
};

// export const getCartProduct = async (userId, jwt) => {
//     // I have to change user carts to user cart in strapi
//     try {
//         const res = await axiosClient.get('/user-carts?filters[userId][$eq]=' + userId + '&populate=*', {
//             headers: {
//                 Authorization: `Bearer ${jwt}`
//             }
//         })
//         const data = res.data.data
//         const cartItemList = data.map((item, index) => ({
//             name: item.products?.data[0].name,
//             quantity: item.quantity,
//             amount: item.amount,
//             image: item.products?.data[0].images.data[0].url,
//             actualPrice: item.products?.data[0].mrp,
//             id: item.id
//         }))
//         return cartItemList;
//     } catch (error) {
//         console.log('Error into get item from cart', error)
//     }
// }


// export const getCartProduct = async (userId, jwt) => {
//     try {
//         const res = await axiosClient.get('/user-carts?filters[userId][$eq]=' + userId + '&populate=*', {
//             headers: {
//                 Authorization: `Bearer ${jwt}`
//             }
//         });

//         const data = res.data.data;

//         const cartItemList = data.map((item) => ({
//             name: item.products?.[0]?.name || "Unknown",
//             quantity: item.quantity,
//             amount: item.amount,
//             image: item.products?.[0]?.image?.[0]?.url 
//                 ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL + item.products[0].image[0].url 
//                 : "", // Ensure full URL
//             actualPrice: item.products?.[0]?.mrp || item.products?.[0]?.sellingPrice || 0,
//             id: item.id
//         }));

//         return cartItemList;
//     } catch (error) {
//         console.log('Error in getting cart items:', error);
//         return [];
//     }
// };

// export const getCartProduct = async (userId, jwt) => {
//     try {
//         const res = await axiosClient.get(`/user-carts?filters[userId][$eq]=${userId}&populate=products.image`, {
//             headers: {
//                 Authorization: `Bearer ${jwt}`
//             }
//         });
//         console.log("Full API Response:", JSON.stringify(res.data, null, 2));

//         const data = res.data.data;

//         const cartItemList = data.map((item) => {
//             const product = item?.attributes?.products?.data?.[0]; // Access first product correctly
//             const imageUrl = product?.attributes?.image?.data?.[0]?.attributes?.url; // Correct Strapi v4 path
//             console.log("Extracted Image URL:", imageUrl);
//             return {
//                 name: product?.attributes?.name || "Unknown",
//                 quantity: item?.attributes?.quantity || 1,
//                 amount: item?.attributes?.amount || 0,
//                 image: imageUrl ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${imageUrl}` : "", // Ensure full URL
//                 actualPrice: product?.attributes?.mrp || product?.attributes?.sellingPrice || 0,
//                 id: item.id
//             };
//         });

//         return cartItemList;
//     } catch (error) {
//         console.log("Error in getting cart items:", error);
//         return [];
//     }
// };

export const getCartProduct = async (userId, jwt) => {
    try {
        const res = await axiosClient.get(
            `/user-carts?filters[userId][$eq]=${userId}&populate=products.image`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        // console.log("Full API Response:", JSON.stringify(res.data, null, 2));

        const data = res.data.data;

        const cartItemList = data.map((item) => {
            const product = item?.products?.[0];
            if (!product) return null;

            const imageUrl =
                product?.image?.formats?.medium?.url ||
                product?.image?.url ||
                "";

            return {
                name: product?.name || "Unknown",
                quantity: item?.quantity || 1,
                amount: item?.amount || 0,
                image: imageUrl
                    ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${imageUrl}`
                    : "",
                actualPrice: product?.sellingPrice || 0,
                id: item.id,
                product: product?.id,
            };
        }).filter(Boolean);

        // console.log("Processed Cart Items:", cartItemList);
        return cartItemList;
    } catch (error) {
        console.log("Error in getting cart items:", error);
        return [];
    }
};


// export const deleteCartItem = async (id, jwt) => {
//     try {
//         const res = await axiosClient.delete(`/user-carts/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${jwt}`
//             }
//         })
//         return res.data
//     } catch (error) {
//         console.log("Error in delete Cart item")
//         return null
//     }
// }

export const deleteCartItem = async (id, jwt) => {
    try {
        // console.log("Sending DELETE request for ID:", id);
        const res = await axiosClient.delete(`/user-carts/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        console.log("Delete API Response Status:", res.status);
        console.log("Delete API Response Data:", res.data);

        return res.status === 204 ? true : res.data;
    } catch (error) {
        console.error("Error in delete Cart item:", error.response?.data || error.message);
        return null;
    }
};


export const createOrder = async (data, jwt) => {
    try {
        const res = await axiosClient.post('/orders', data, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
        return res.data
    } catch (error) {
        console.log("Error in Createorder", error)
    }
}

// export const createOrder = async (orderData, jwt) => {

//     try {
//         console.log("🚀 Sending Order Data:", JSON.stringify(orderData, null, 2));

//         const response = await axiosClient.post("/orders", orderData, {
//             headers: {
//                 Authorization: `Bearer ${jwt}`,
//                 "Content-Type": "application/json",
//             },
//         });

//         console.log("✅ Order Created Successfully:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error in CreateOrder:", error.response?.data || error.message);
//         throw error;
//     }
// };

// export const getMyOrder = async (userId, jwt) => {
//     try {
//         const res = await axiosClient.get(`/orders?filters[userId][$eq]=${userId}&populate[orderItemList][populate][product][populate][images]=url`)
//         console.log('getallmyorders', res.data)
//         const responce = res.data.data
//         const orderList = responce.map(item => ({
//             id: item.id,
//             totalOrderAmount: item.totalOrderAmount,
//             paymentId: item.paymentId,
//             orderItemList: item.orderItemList
//         }))
//         return orderList
//     } catch (error) {
//         console.log('Error in getmyorders', error)
//     }
// } 




export const getMyOrder = async (userId, jwt) => {
    try {
        const res = await axiosClient.get(`/orders?filters[userId][$eq]=${userId}&populate=*`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        console.log('getallmyorders', res.data);
        const response = res.data.data;

        return response.map(item => ({
            id: item.id,
            totalOrderAmount: item.attributes?.totalOrderAmount || 0,
            paymentId: item.attributes?.paymentId || "N/A",
            orderItemList: item.attributes?.orderItemList || [],
            createdAt : item?.createdAt,
        }));
    } catch (error) {
        console.error('Error in getMyOrder:', error);
        return [];
    }
};








