

import React from 'react'
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { LuMinus } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";


function FoodCard({ data }) {

    function starRating({ rating }) {
        return (<div className='flex gap-1'>

            {
                Array.from({ length: 5 }, (_, index) => {
                    index <= rating ? (<FaStar className='text-yellow-300' key={index} />
                    ) : (
                        <FaRegStar className='text-yellow-500' key={index} />

                    )
                })
            }

        </div>);


    }




    return (
        <div className=' flex flex-col w-60 relative  rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-xl  '>

            <div className=' h-40 w-60'>
                <img src={data.image} alt="w-full object-cover h-full" />
            </div>
            <div className='flex flex-col w-full'>
                <div className='text-black '>{data.name}</div>
                <div className='flex'  >
                    {starRating(4)}
                    {data.averageRating}
                </div>
                <div className='w-full p-2' >
                    <div className='text-black'>
                        199
                    </div>
                    <div className=' flex rounded-2xl items-center '>
                        <LuMinus className='text-black cursor-pointer' />
                        <div className='text-black'>0</div>

                        <IoMdAdd className='text-black cursor-pointer' />

                        <div className='bg-[#ff4d2d] cursor-pointer '>
                            <FaShoppingCart className='text-white' />

                        </div>

                    </div>


                </div>

            </div>


        </div>
    )
}

export default FoodCard