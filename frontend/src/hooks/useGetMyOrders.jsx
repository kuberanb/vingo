import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setMyOrders } from "../redux/userSlice";


function useGetMyOrders() {
    const dispatch = useDispatch();

    useEffect(() => {

        const myOrders = async () => {

            try {

                const repsonse = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true });
                console.log(`useGetMyOrders data : `,repsonse.data  );


                dispatch(setMyOrders(repsonse.data));

            } catch (error) {
                console.log(`useGetMyOrders error : ${error}`);

            }
        }

        myOrders();
    }, [dispatch]);

}


export default useGetMyOrders;
