

import React from 'react'
import { FiMinus } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, deleteCartItem } from '../redux/userSlice';


function CartItemCard({ data }) {
    const dispatch = useDispatch();
    const totalAmount = useSelector((state) => state.user.totalAmont);

    function handleIncrease() {
        dispatch(updateQuantity({ id: data.id, quantity: data.quantity + 1 }));
    }

    function handleDecrease() {
        if (data.quantity > 1) {
            dispatch(updateQuantity({ id: data.id, quantity: data.quantity - 1 }));
        }
    }

    function deleteItem() {
        dispatch(deleteCartItem({ id: data.id }));
    }


    return (
        <div className='w-full flex shadow-lg justify-start  items-center border border-gray-800 rounded-lg p-2 overflow-hidden'>
            <div className='rounded-xl border border-gray-500 w-20 h-20 shrink-0 '>
                <img src={data.image} alt={data.name} className='object-cover w-full h-full ' />
            </div>
            <div className='p-2 flex justify-between flex-1'>

                <div className=' flex flex-col'>
                    <h2 className='font-semibold text-black pb-0.5 text-lg '>{data.name}</h2>
                    <p className='text-gray-800 pb-0.5 text-sm '>₹ {data.price} * {data.quantity}</p>
                    <p className='font-semibold text-black text-base'>₹ {data.price * data.quantity}</p>
                </div>

                <div className=' flex flex-row gap-1 items-center'>

                    <div onClick={handleDecrease} className=' rounded-full flex justify-center items-center bg-gray-200 p-1 hover:cursor-pointer transition-colors duration-300 hover:bg-red-500/20'>
                        <FiMinus className='font-semibold' size={20} />
                    </div>

                    <h1 className='font-semibold'>{data.quantity}</h1>

                    <div onClick={handleIncrease} className='rounded-full bg-gray-200 flex justify-center items-center p-1 transition-colors duration-300 hover:cursor-pointer hover:bg-red-500/20'>
                        <IoIosAdd className='font-semibold' size={20} />
                    </div>

                    <div onClick={deleteItem} className='rounded-full bg-red-500/70 flex justify-center items-center p-1 transition-colors duration-300 hover:cursor-pointer hover:bg-red-500/20'>
                        <MdDeleteOutline className='font-semibold' size={20} />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CartItemCard