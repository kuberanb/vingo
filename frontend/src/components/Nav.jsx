
import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';


function Nav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const city = useSelector((state) => state.user.city);
  const dispatch = useDispatch();
  const handleLogout = async () => {

    try {

      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log("LogOut Successful");

    } catch (error) {
      console.error("Logout failed:", error);
    }

  }



  return (
    <div className=''>

      <div className='w-full h-20 flex items-center justify-between fixed top-0 left-0 z-9999 overflow-visible bg-[#fff9f6] p-4 '>

        {/* Left */}
        <h1 className='text-3xl font-bold  text-[#ff4d2d]' >Vingo</h1>

        {/* Center */}
        <div className=' h-12 md:w-[55%] lg:w-[40%]  shadow-xl hidden px-4  md:flex items-center '  >
          <div className='flex gap-2 items-center px-5 ' >
            <FaLocationDot size={20} className='text-[#ff4d2d]' />
            <div className='text-sm overflow-hidden ellipsis' >{city}</div>
          </div>
          {/* Vertical Divider */}
          <div className="w-px h-5 bg-gray-300 mx-3"></div>

          <div className='flex items-center gap-2 w-full'>
            <IoSearchOutline size={20} className='text-[#ff4d2d]' />
            <input placeholder='Search delicious foods...' className='w-full h-10 px-3 focus:outline-none' type="text" />
          </div>


        </div>

        {/* Right */}
        <div className='flex items-center gap-4 '>
          {
            !isSearchOpen ? (<IoSearchOutline onClick={() => setIsSearchOpen(!isSearchOpen)} size={35} className='text-[#ff4d2d] md:hidden font-bold  cursor-pointer ' />
            ) : (<IoMdClose onClick={() => setIsSearchOpen(!isSearchOpen)} size={35} className='text-[#ff4d2d] md:hidden font-bold  cursor-pointer ' />
            )

          }

          <div className='flex items-center justify-center relative cursor-pointer'>
            <MdOutlineShoppingCart className='' size={30} />
            <p className=' absolute -top-2.5 right-5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs' >0</p>
          </div>
          <button className='hidden md:flex  bg-[#ff4d2d]/10 text-[#ff4d2d] px-4 py-2 rounded-lg cursor-pointer'>My Orders</button>
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className='h-12 w-12 flex justify-center items-center rounded-full text-white text-xl  bg-amber-800 border-2 border-amber-700 relative cursor-pointer'>{userData?.fullName?.charAt(0)}</div>
        </div>
        {isProfileOpen && (
          <div className="absolute top-14 right-0 w-44 bg-white shadow-lg rounded-lg z-9999">
            <p className="px-4 py-2 text-sm border-b">
              {userData?.fullName}
            </p>
            <button className=" w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              My Profile
            </button>
            <button className=" w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              My Orders
            </button>
            <button onClick={handleLogout} className=" w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
      {
        isSearchOpen && (

          <div className='flex items-center justify-center mt-2' >

            <div className=' fixed top-22 w-[90%] justify-center  h-15  flex md:hidden  shadow-xl px-4   items-center '  >
              <div className='flex gap-2 items-center px-2 ' >
                <FaLocationDot size={20} className='text-[#ff4d2d]' />
                <div className='text-sm overflow-hidden ellipsis' >{city} </div>
              </div>
              {/* Vertical Divider */}
              <div className="w-px h-5 bg-gray-300 mx-3"></div>

              <div className='flex items-center gap-2 w-full'>
                <IoSearchOutline size={20} className='text-[#ff4d2d]' />
                <input placeholder='Search delicious foods...' className='w-full h-10 px-3 focus:outline-none' type="text" />
              </div>
            </div>
          </div>
        )
      }

    </div>



  )
}

export default Nav