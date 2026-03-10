import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import { setMyShopData } from '../redux/ownerSlice';

function CreateEditShop() {
    const navigate = useNavigate();
    const myShopData = useSelector((state) => state.owner.myShopData);

    const [frontendImage, setFrontendImage] = useState(myShopData?.image || "");
    const [backendImage, setBackendImage] = useState(null);

    const currentCity = useSelector((state) => state.user.city);
    const currentState = useSelector((state) => state.user.state);
    const currentAddress = useSelector((state) => state.user.address);

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [shopState, setShopState] = useState("");
    const [address, setAddress] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (myShopData) {
            setName(myShopData.name || "");
            setCity(myShopData.city || "");
            setShopState(myShopData.state || "");
            setAddress(myShopData.address || "");
            setFrontendImage(myShopData.image || "");
            return;
        }

        setCity(currentCity || "");
        setShopState(currentState || "");
        setAddress(currentAddress || "");
    }, [myShopData, currentCity, currentState, currentAddress]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("city", city);
            formData.append("state", shopState);
            formData.append("address", address);
            if (backendImage) {
                formData.append("image", backendImage)
            }

            const response = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, { withCredentials: true });
            dispatch(setMyShopData(response.data.shop));
            navigate(`/`);
            console.log("handleSubmit:", response.data);
        } catch (e) {
            console.log(`error : ${e}`);
        }

    }

    return (
        <div className='flex flex-col   w-full min-h-screen bg-[#fff9f6]'>
            <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />

            <div className=' flex items-center justify-center min-h-screen w-full  '>

                <div className='text-center max-w-lg md:max-w-md shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center  '>
                    <div className="flex items-center justify-center p-4 rounded-full bg-[#ff4d2d]/10 mb-2 ">
                        <FaUtensils size={60} className="text-[#ff4d2d]" />
                    </div>
                    {
                        myShopData ? (<div className=' font-black   text-lg mb-2 '>
                            Edit Shop
                        </div>) : (<div className=' font-black   text-lg mb-2 '>
                            Create Shop
                        </div>)

                    }

                    <form onSubmit={handleSubmit} action="" >
                        <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
                            <label htmlFor="name" className=' text-sm font-semibold ' >Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter shop name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full text-md' />
                        </div>

                        <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
                            <label htmlFor="shopImage" className='  text-sm font-semibold ' >Shop Image</label>
                            <input type="file" onChange={handleImage} className='w-full rounded-lg text-md cursor-pointer border px-2 py-1 hover:ring-0.5 bg-white hover:bg-gray-200 duration-300' />

                            {
                                frontendImage && <div className='mt-4'>
                                    <img src={frontendImage} alt="" className='h-48 w-full rounded-lg object-cover border ' />
                                </div>
                            }
                        </div>

                        <div className=' grid grid-cols-1 md:grid-cols-2  gap-4 mb-4 '>
                            <div className='  flex flex-col items-start gap-1 '>
                                <label htmlFor="city" className='  text-sm font-semibold ' >City</label>
                                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter city name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full  text-md' />
                            </div>

                            <div className='w-full  flex flex-col items-start gap-1 '>
                                <label htmlFor="state" className='  text-sm font-semibold ' >State</label>
                                <input onChange={(e) => setShopState(e.target.value)} value={shopState} placeholder='Enter state name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full  text-md' />
                            </div>
                        </div>

                        <div className=' flex w-full flex-col items-start gap-1 mb-4 '>
                            <label htmlFor="address" className='  text-sm font-semibold ' >Address</label>
                            <input onChange={(e) => setAddress(e.target.value)} value={address} placeholder='Enter shop address ' type="text" className=' rounded-lg ring-1 duration-300 px-2 py-1 text-md w-full' />
                        </div>

                        <button type='submit' className='bg-[#ff4d2d] w-full text-white px-2 py-1 rounded-lg hover:bg-[#ff4d2d]/80 duration-300 mb-4 cursor-pointer'>Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateEditShop

