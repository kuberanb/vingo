
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import OwnerOrderCard from '../components/OwnerOrderCard';
import UserOrderCard from '../components/UserOrderCard';

function MyOrders() {
    const navigate = useNavigate();
    const { userData, myOrders } = useSelector((state) => state.user);
    return (
        <div className='w-full min-h-screen bg-[#fff9f6]'>
            <div className='flex items-center justify-center relative h-14 bg-[#fff9f6]'>

                {/* Back Arrow (left) */}
                <IoIosArrowRoundBack
                    onClick={() => navigate("/")}
                    size={30}
                    className='absolute left-4 text-[#ff4d2d] cursor-pointer'
                />

                {/* Center Title */}
                <h1 className='text-lg font-semibold text-black'>
                    My Orders
                </h1>
            </div>

            <div className='w-full h-full'>

                <div className=' w-full max-w-200 p-4 flex '>
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