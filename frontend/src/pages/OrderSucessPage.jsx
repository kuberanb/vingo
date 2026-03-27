
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

function OrderSucessPage() {
    const navigate = useNavigate();
    return (
        <div className='w-full min-h-screen bg-[#fff9f6]'>
            <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />

            <div className='w-full min-h-screen flex fle-col justify-center items-center' >

                Order Sucess Screen

            </div>



        </div>
    )
}

export default OrderSucessPage