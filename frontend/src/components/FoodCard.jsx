

import React from 'react'
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { LuMinus } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";
import { useState } from 'react';
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice'
import { useEffect } from 'react';

function FoodCard({ data }) {
    const [foodCount, setFoodCount] = useState(1);
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.user);
    const isInCart = cartItems.find((item) => item.id === data._id)
    // useEffect(() => {
    //     if (isInCart) {
    //         setFoodCount(isInCart.quantity);
    //     }
    // }, [isInCart]);
    const increaseFoodCount = () => {
        setFoodCount(foodCount + 1);
    }


    const decreaseFoodCount = () => {
        if (foodCount > 1) {
            setFoodCount(foodCount - 1);

        }
    }

    function starRating({ rating }) {
        return (<div className='flex gap-1'>

            {
                Array.from({ length: 5 }, (_, index) =>
                    index < rating ? (<FaStar className='text-yellow-300' key={index} />
                    ) : (
                        <FaRegStar className='text-yellow-500' key={index} />

                    )
                )
            }

        </div>);

    }


    return (
        <div className=' flex flex-col w-60 overflow-hidden relative  rounded-2xl border-2 border-brand-primary bg-white shadow-xl cursor-pointer '>

            <div className=' h-40 w-60 relative'>
                <img src={data.image} alt={data.name}
                    className="w-full object-cover h-full " />
                {
                    data.foodType === "Veg" && (
                        <div className="absolute top-4 right-4 m-2 w-7 h-7 flex items-center justify-center rounded-full bg-white">
                            <FaLeaf size={14} className="text-green-500" />
                        </div>
                    )
                }
                {
                    data.foodType == "Non-Veg" &&
                    <div className="absolute top-4 right-4 m-2 w-7 h-7 flex items-center justify-center rounded-full bg-white">
                        <FaDrumstickBite size={20} className='text-red-500   top-4 right-4 absolute' />

                    </div>


                }

            </div>
            <div className='flex flex-col w-full p-4'>
                <div className='text-black font-semibold '>{data.name}</div>
                <div className='flex w-full  justify-start items-center gap-1 mb-2'  >
                    {starRating({ rating: data.rating.average })}
                    {data.rating.count}
                </div>
                <div className='w-full flex flex-row justify-between' >
                    <div className='text-black font-semibold'>
                        ₹ {data.price}
                    </div>
                    <div className=' flex rounded-2xl items-center justify-between border '>

                        <div className='flex items-center px-2 gap-1 '>
                            <LuMinus size={20} onClick={decreaseFoodCount} className='text-black cursor-pointer font-semibold hover:bg-gray-300 hover:rounded-full' />
                            <div className='text-black font-semibold'>{foodCount}</div>

                            <IoMdAdd onClick={increaseFoodCount} size={20} className='text-black cursor-pointer font-semibold hover:bg-gray-300 hover:rounded-full ' />
                        </div>

                        <div className={` cursor-pointer flex h-full px-2 rounded-r-2xl ${isInCart ? 'bg-gray-500' : 'bg-brand-primary'}        `}>
                            <FaShoppingCart onClick={

                                () => {
                                    dispatch(addToCart({
                                        id: data._id,
                                        name: data.name,
                                        price: data.price,
                                        image: data.image,
                                        shop: data.shop,
                                        quantity: foodCount,
                                        foodType: data.foodType
                                    }
                                    ));

                                    setFoodCount(1);

                                }
                            } size={15} className={`  text-white font-semibold m-1 hover:scale-110 transition-transform duration-300 `}
                            />
                        </div>

                    </div>

                </div>

            </div>


        </div>
    )
}

export default FoodCard