import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopInMyCity } from "../redux/userSlice";


function useGetShopByCity() {
    const currentCity = useSelector((state) => state.user.city);
    const dispatch = useDispatch();

    useEffect(() => {

        async function fetchShops() {
            if (!currentCity) return;

            try {

                const response = await axios.get(`${serverUrl}/api/shop/shops`, { withCredentials: true, params: { city: currentCity } });

                dispatch(setShopInMyCity(response.data))

            } catch (error) {
                console.log(`fetchShops error : ${error} `);
            }
        }

        fetchShops();
    }, [currentCity, dispatch])

}

export default useGetShopByCity;

