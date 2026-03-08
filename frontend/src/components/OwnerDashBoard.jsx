
import React from 'react'
import Nav from './Nav'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";



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

      {
        myshopData && (<div className='w-full flex flex-col items-center gap-4  px-4  sm:px-6 '>

          {/* Heading */}
          <div className='flex justify-center items-center gap-2'>
            <FaUtensils size={30} className=' text-[#ff4d2d]  ' />
            <h1 className=' text-lg md:text-xl font-semibold text-center'>Welcome to {myshopData.name}</h1>
          </div>

          {/* Shop Image and location box */}
          <div className='w-full  md:max-w-xl shadow-lg rounded-b-lg  bg-white '>
            <div className='w-full overflow-hidden border rounded-t-lg max-h-60 mb-2 relative'>
              <img src={myshopData.image} className='object-cover w-full h-full' alt="Shop Image" />
              <MdOutlineEdit size={30} className='text-white p-1 bg-[#ff4d2d] top-10 sm:top-12  md:top-12 lg:top-10 right-2 cursor-pointer rounded-full absolute' />

            </div>
            <div className='px-4 py-2 mb-3 '>
              <h1 className='text-xl mb-1 font-semibold'>{myshopData.name}</h1>
              <div className=' mb-1 text-xs text-gray-500' > {myshopData?.city},{myshopData?.state}</div>
              <div className=' text-xs text-gray-500'>{myshopData.address}</div>
            </div>
          </div>
          {
            myshopData.items.length === 0 &&
            <div className=''>
              <div className='max-w-md w-full bg-white shadow-2xl rounded-2xl t  flex-col flex justify-center items-center p-4 sm:p-6'>
                <FaUtensils size={60} className=' text-[#ff4d2d] mb-2 ' />
                <div className='font-bold text-black mb-2 text-2xl  text-center  '>Add Your Food Item</div>
                <div className='text-gray-500 text-sm mb-2 text-center'>
                  Share your delicious creations with our cutsomers by adding them to the menu.
                </div>
                <button onClick={() => navigate("/add-food-item")} className='rounded-4xl shadow-md ring-1 bg-[#ff4d2d] text-white px-4 py-2 mb-2 cursor-pointer hover:bg-orange-600 transition-colors duration-300  '>Add Food Item</button>
              </div>

            </div>


          }





          {/* Items List */}

          {/* Item */}
          <div className="flex h-27.5 w-[80%] max-w-lg  border rounded-lg border-[#ff4d2d] bg-white shadow-lg overflow-hidden">

            <div className=' min-h-27.5 w-27.5  shrink-0 '>
              <img src={myshopData.image} alt="Item Image" className='h-27.5 w-27.5 object-cover rounded-l-lg ' />
            </div   >
            <div className='flex flex-col justify-start px-2 py-2  flex-1 min-w-0'>

              <div className='text-[#ff4d2d]'>Burger</div>
              <div className="text-sm">
                <span className="font-semibold text-gray-800 ">Category:</span> Burger
              </div>

              <div className="text-sm">
                <span className="font-semibold text-gray-800">Food Type: </span> Veg
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex'>₹ 200</div>

                <div className=' flex gap-2'>
                  <MdOutlineEdit size={25} className='text-[#ff4d2d]  cursor-pointer hover:bg-gray-100 p-0.5 rounded-full' />
                  <MdDeleteOutline size={25} className='text-[#ff4d2d]  cursor-pointer hover:bg-gray-100 p-0.5 rounded-full' />

                </div>

              </div>

            </div>

          </div>









        </div>)
      }



    </div >
  )
}

export default OwnerDashBoard

