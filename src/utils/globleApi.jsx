import axios from "axios";

const axiosClient = axios.create({
    baseURL: "grocery-store-admin.up.railway.app/api"
})

export const getCategory = async () => {
    try {
        const res = await axiosClient.get("/categories?populate=*")
        return res.data;
    } catch (error) {
        console.log("Error in fetch category", error)
        return null;
    }
}


export const getSlider = async () => {
    try {
        const res = await axiosClient.get("/sliders?populate=*")
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
        return res.data;
    } catch (error) {
        console.error("Error in addCart API:", error.response?.data || error.message);
    }
};


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

        return cartItemList;
    } catch (error) {
        console.log("Error in getting cart items:", error);
        return [];
    }
};




export const deleteCartItem = async (id, jwt) => {
    try {
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








