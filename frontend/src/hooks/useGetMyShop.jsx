import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { useDispatch } from "react-redux";

function useGetMyShop() {
    const dispatch = useDispatch();

    useEffect(() => {

        const fetchMyshop = async () => {
            console.log("fetchMyshop running ....");
            try {

                const response = await axios.get(
                    `${serverUrl}/api/shop/current-shop`,
                    { withCredentials: true }
                );

                console.log("my shop response:", response.data);
                dispatch(setMyShopData(response.data));

            } catch (error) {
                console.log("fetch my shop error:", error.response?.data || error.message);
            }
        };

        fetchMyshop();

    }, []);
}

export default useGetMyShop;