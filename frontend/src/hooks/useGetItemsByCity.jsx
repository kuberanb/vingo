import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setItemsInMyCity } from "../redux/userSlice";
import { useSelector } from "react-redux";


function useGetItemsByCity() {
    const dispatch = useDispatch();
    const currentCity = useSelector((state) => state.user.city);

    useEffect(() => {

        const getItemsByCity = async () => {

            try {
                const response = await axios.get(

                    `${serverUrl}/api/item/items?city=${currentCity}`,

                    { withCredentials: true });

                dispatch(setItemsInMyCity(response.data.itemsList))

            } catch (error) {
                console.log(`getAllItems hook error : ${error}`);

            }

        }

        if (currentCity) {
            getItemsByCity();
        }
    }, [currentCity, dispatch])


}

export default useGetItemsByCity;