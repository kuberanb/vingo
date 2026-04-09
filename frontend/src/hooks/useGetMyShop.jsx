import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function useGetMyShop() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);

    useEffect(() => {

        if (userData?.role !== "owner") return;


        const fetchMyshop = async () => {
            console.log("fetchMyshop running ....");
            try {

                const response = await axios.get(
                    `${serverUrl}/api/shop/current-shop`,
                    { withCredentials: true }
                );

                console.log("my shop response:", response.data);
                dispatch(setMyShopData(response.data.shop));

            } catch (error) {
                console.log("fetch my shop error:", error.response?.data || error.message);
            }
        };

        fetchMyshop();

    }, [dispatch, userData]);
}

export default useGetMyShop;