import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import CartItemCard from '../components/CartItemCard';

function CartPage() {
    const { cartItems, totalAmount } = useSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <div className='w-full min-h-screen bg-brand-surface'>

            {/* 🔷 AppBar */}
            <div className='flex items-center justify-center relative h-14 bg-brand-surface'>

                {/* Back Arrow (left) */}
                <IoIosArrowRoundBack
                    onClick={() => navigate("/")}
                    size={30}
                    className='absolute left-4 text-brand-primary cursor-pointer'
                />

                {/* Center Title */}
                <h1 className='text-lg font-semibold text-black'>
                    Cart
                </h1>
            </div>

            {/* 🔷 Body */}

            <div className='flex justify-center w-full  '>
                <div className='p-6 w-full md:max-w-2xl '>
                    {
                        cartItems.length === 0 ? (
                            <div className='text-center text-gray-500'>
                                Your cart is empty 🛒
                            </div>
                        ) : (
                            <div className='flex flex-col items-center w-full  gap-4'>
                                {cartItems.map((item, index) => (

                                    <CartItemCard key={index} data={item} />

                                ))}
                                <div className='w-full flex shadow-lg justify-between items-center border border-gray-800 rounded-lg p-2 overflow-hidden mb-2' >
                                    <div className=' font-bold text-black'>
                                        Total Amount
                                    </div>
                                    <div className=' font-bold text-brand-primary'>
                                        ₹ {totalAmount}
                                    </div>

                                </div>


                                <div className='w-full flex shadow-lg justify-end items-center border border-gray-800 rounded-lg p-2 overflow-hidden mb-2 ' >
                                    <button onClick={() => navigate('/checkout')} className='bg-brand-primary rounded-xl px-3 py-1 cursor-pointer transition-colors duration-300 hover:border hover:border-black text-white font-semibold'>
                                        Proceed to Checkout
                                    </button>

                                </div>

                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default CartPage