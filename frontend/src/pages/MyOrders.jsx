
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import OwnerOrderCard from '../components/OwnerOrderCard';
import UserOrderCard from '../components/UserOrderCard';
import { addMyOrder, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
    const navigate = useNavigate();
    const { userData, myOrders, socket } = useSelector((state) => state.user);
    const dispatch = useDispatch();


    useEffect(() => {
        socket?.on('newOrder', (data) => {

            if (data.shopOrder?.[0]?.owner._id === userData._id) {
                dispatch(addMyOrder(data));
            }
        });

        socket?.on('update-status', ({ orderId, shopId, status, userId }) => {
            if (userId == userData._id) {
                dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
            }
        });

        return () => {
            socket?.off('newOrder');
            socket?.off('update-status')
        }

    }, [socket]);


    return (
        <div className='w-full min-h-screen bg-brand-surface'>
            <div className='flex items-center justify-center relative h-14 bg-brand-surface'>

                {/* Back Arrow (left) */}
                <IoIosArrowRoundBack
                    onClick={() => navigate("/")}
                    size={30}
                    className='absolute left-4 text-brand-primary cursor-pointer'
                />

                {/* Center Title */}
                <h1 className='text-lg font-semibold text-black'>
                    My Orders
                </h1>
            </div>

            <div className='w-full h-full flex items-center justify-center'>

                <div className=' w-full max-w-200 p-4 '>
                    <div className='space-y-6'>
                        {

                            myOrders.map((order, index) => (
                                userData.role === "user" ? (<UserOrderCard data={order} key={index} />) : userData.role === "owner" ? (<OwnerOrderCard data={order} key={index} />) : null
                            )

                            )}

                    </div>


                </div>


            </div>


        </div>
    )
}

export default MyOrders