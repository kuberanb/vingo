

import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function useGetCurentUser() {
    const dispatch = useDispatch();


    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {

                const response = await axios.get(`${serverUrl}/api/user/get-current-user`, { withCredentials: true })

                console.log('current user response : ', response.data);
                const safeUser = JSON.parse(JSON.stringify(response.data.user));

                dispatch(setUserData(safeUser));
            } catch (error) {
                console.log(`fetch current user error : ${error}`);
            }
        }

        fetchCurrentUser();
    }, [])


}

export default useGetCurentUser