
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useSelector } from 'react-redux';

function CreateEditShop() {
    const navigate = useNavigate();
    const myShopData = useSelector((state) => state.owner.myShopData);
    const curentCity = useSelector((state) => state.owner.curentCity);
    const currentState = useSelector((state) => state.owner.currentState);
    const currentAddress = useSelector((state) => state.owner.currentAddress);
    const [name, setName] = useState(myShopData?.name || "");
    const [city, setCity] = useState(myShopData?.city || curentCity);
    const [state, setState] = useState(myShopData?.state || currentState);
    const [address, setAddress] = useState(myShopData?.address || currentAddress);
    return (
        <div className='flex flex-col   w-full min-h-screen bg-[#fff9f6]'>
            <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />

            <div className=' flex items-center justify-center min-h-screen  '>

                <div className='text-center max-w-md shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center  '>
                    <div className="flex items-center justify-center p-4 rounded-full bg-[#ff4d2d]/10 mb-2 ">
                        <FaUtensils size={60} className="text-[#ff4d2d]" />
                    </div>
                    {/* Title */}
                    {
                        myShopData ? (<div className=' font-black   text-lg mb-2 '>
                            Edit Shop
                        </div>) : (<div className=' font-black   text-lg mb-2 '>
                            Create Shop
                        </div>)

                    }

                    {/* Name */}
                    <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
                        <label htmlFor="name" className=' text-sm font-semibold ' >Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} typeof='name' placeholder='Enter shop name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full text-md' />
                    </div>

                    {/* Shop Image */}
                    <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
                        <label htmlFor="shopImage" className='  text-sm font-semibold ' >Shop Image</label>
                        <button className=' w-full rounded-lg text-md cursor-pointer border px-2 py-1 hover:ring-0.5 bg-white hover:bg-gray-200 duration-300'>Choose File</button>
                    </div>

                    <div className=' grid grid-cols-1 md:grid-cols-2  gap-4 mb-4 '>
                        {/* City */}
                        <div className='  flex flex-col items-start gap-1 '>
                            <label htmlFor="city" className='  text-sm font-semibold ' >City</label>
                            <input value={city} onChange={(e) => setCity(e.target.value)} typeof='city' placeholder='Enter city name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full  text-md' />
                        </div>

                        {/* State */}
                        <div className='w-full  flex flex-col items-start gap-1 '>
                            <label htmlFor="state" className='  text-sm font-semibold ' >State</label>
                            <input onChange={(e) => setState(e.target.value)} value={state} typeof='state' placeholder='Enter state name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full  text-md' />
                        </div>
                    </div>

                    {/* Address */}
                    <div className=' flex w-full flex-col items-start gap-1 mb-4 '>
                        <label htmlFor="address" className='  text-sm font-semibold ' >Address</label>
                        <input onChange={(e) => setAddress(e.target.value)} value={address} typeof='address' placeholder='Enter shop address ' type="text" className=' rounded-lg ring-1 duration-300 px-2 py-1 text-md w-full' />
                    </div>

                    {/* Save */}
                    <button className='bg-[#ff4d2d] w-full text-white px-2 py-1 rounded-lg hover:bg-[#ff4d2d]/80 duration-300 mb-4 cursor-pointer'>Save</button>


                </div>

            </div>


        </div>
    )
}

export default CreateEditShop