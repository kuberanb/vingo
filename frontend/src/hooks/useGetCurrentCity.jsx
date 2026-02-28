import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentCity } from "../redux/userSlice";


function useGetCurrentCity() {

    const dispatch = useDispatch();

    useEffect(() => {

        async function getCurrentLocation() {

            try {

                navigator.geolocation.getCurrentPosition(async (position) => {

                    let response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)

                    dispatch(setCurrentCity(response.data.results[0].city));
                },
                    (error) => {
                        console.log(`Error getting location: ${error.message}`);
                    }

                )

            } catch (error) {
                console.log("Error getting location:", error);
            }

        };

        getCurrentLocation();
    }, [])

}


export default useGetCurrentCity






