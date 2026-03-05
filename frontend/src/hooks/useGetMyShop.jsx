import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";


function useGetMyShop() {
    const dispatch = useDispatch();

    useEffect(() => {


        const fetchMyshop = async () => {

            try {

                const response = await axios.get(`${serverUrl}/api/shop/current-shop`, { withCredentials: true });
                dispatch(setMyShopData(response.data));


            } catch (error) {
                console.log(`fetch my shop error : ${error}`);
            }


        }

        fetchMyshop();
    }, []);


}

export default useGetMyShop;
