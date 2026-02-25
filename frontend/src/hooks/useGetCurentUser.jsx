

import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App';

function useGetCurentUser() {

    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {

                const response = await axios.get(`${serverUrl}/api/user/get-current-user`, { withCredentials: true })

                console.log('current user response : ', response.data);

            } catch (error) {
                console.log(`fetch current user error : ${error}`);
            }
        }

        fetchCurrentUser();
    }, [])


}

export default useGetCurentUser