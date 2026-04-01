
import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";

function useUpdateLocation() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);


    useEffect(() => {
        if (!userData) return;


        async function updateLocation(lat, lon) {

            try {
                const result = await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true });
                console.log(`useUpdateLoaction : `, result.data);
            } catch (error) {
                console.log(`updateLocation error : `, error);
            }

        }

        navigator.geolocation.watchPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude);
        })


    }, [userData]);

}

export default useUpdateLocation;