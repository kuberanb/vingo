
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaCircleCheck } from "react-icons/fa6";

function OrderSucessPage() {
    const navigate = useNavigate();
    return (
        <div className='w-full min-h-screen bg-[#fff9f6]'>
            <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />
            <div className='w-full  min-h-screen flex flex-col justify-center items-center' >
                <FaCircleCheck className='text-green-500 text-6xl mb-4' />
                <h1 className='text-3xl font-bold text-gray-800 mb-2 text-center' >Order Placed!</h1>
                <p className='mb-6 text-gray-600 max-w-md'>Thank you for your purchase. Your order is being prepared.
                    You can track your order status in the "My Orders" section,
                </p>
                <button onClick={() => navigate('/my-orders')} className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition'>Back to my orders</button>
            </div>

        </div>
    )
}

export default OrderSucessPage