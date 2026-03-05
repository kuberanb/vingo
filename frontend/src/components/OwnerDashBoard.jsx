
import React from 'react'
import Nav from './Nav'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

function OwnerDashBoard() {
  const myshopData = useSelector((state) => state.owner.myShopData);
  const navigate = useNavigate();
  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'
    ><Nav />
      {
        !myshopData && (

          <div className=''>
            <div className='max-w-md w-full bg-white shadow-2xl rounded-2xl t  flex-col flex justify-center items-center p-4 sm:p-6'>
              <FaUtensils size={60} className=' text-[#ff4d2d] mb-2 ' />
              <div className='font-bold text-black mb-2 text-2xl  text-center  '>Add Your Restuarant</div>
              <div className='text-gray-500 text-sm mb-2 text-center'>
                Join our food delivery platform and reach thousands of hungry customers everyday.
              </div>
              <button onClick={() => navigate("/create-edit-shop")} className='rounded-4xl shadow-md ring-1 bg-[#ff4d2d] text-white px-4 py-2 mb-2 cursor-pointer hover:bg-orange-600 transition-colors duration-300  '>Get Started</button>
            </div>

          </div>
        )
      }

      

    </div>
  )
}

export default OwnerDashBoard

