import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import CategoryCard from './CategoryCard'
import { categories } from '../category'
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { scrollLeft, scrollRight, checkScroll } from "../utils/scrollUtils";


function UserDashBoard() {
  const [leftCat, setLeftCat] = useState(false);
  const [rightCat, setRightCat] = useState(false);
  const [leftShop, setLeftShop] = useState(false);
  const [rightShop, setRightShop] = useState(false);

  const catRef = useRef(null);
  const shopRef = useRef(null);

  const currentCity = useSelector((state) => state.user.city);
  const shopsInMyCity = useSelector((state) => state.user.shopsInMyCity);

  useEffect(() => {
    checkScroll(catRef, setLeftCat, setRightCat);
    checkScroll(shopRef, setLeftShop, setRightShop);
  }, []);



  return (
    <div className=' flex flex-col w-full min-h-screen gap-5 items-center bg-[#fff9f6] '>
      <Nav />
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl' >Inspiration for your first order</h1>
        <div className='w-full relative'>
          {
            leftCat &&
            <button onClick={() => scrollLeft(catRef)} className='absolute left-2 z-10 top-1/2 rounded-full p-1 bg-[#ff4d2d] -translate-y-1/2  shadow-xl cursor-pointer'>
              <FaChevronCircleLeft className='text-white ' size={15} />
            </button>

          }
          <div ref={catRef} onScroll={() => checkScroll(catRef, setLeftCat, setRightCat)}
            className='w-full flex flex-row gap-4 pb-2 overflow-x-auto' >
            {categories.map((value, index) => <CategoryCard name={value.category} imageUrl={value.image} key={index} />)}
          </div>
          {
            rightCat && <button onClick={() => scrollRight(catRef)} className='absolute right-2 z-10 top-1/2 shadow-xl cursor-pointer -translate-y-1/2 rounded-full p-1 bg-[#ff4d2d]'>
              <FaChevronCircleRight className='text-white' size={15} />
            </button>
          }
        </div>



        <h1 className='text-gray-800 text-2xl sm:text-3xl' >Best Shop in {currentCity}</h1>

        {
          !shopsInMyCity || shopsInMyCity.length === 0 ?
            <div className='flex text-black text-xl '>
              No Shops in your city
            </div> :
            <div className='w-full relative'>
              {
                leftShop &&
                <button onClick={() => scrollLeft(shopRef)} className='absolute left-2 z-10 top-1/2 rounded-full p-1 bg-[#ff4d2d] -translate-y-1/2  shadow-xl cursor-pointer'>
                  <FaChevronCircleLeft className='text-white ' size={15} />
                </button>

              }
              <div ref={shopRef} onScroll={() => checkScroll(shopRef, setLeftShop, setRightCat)}
                className='w-full flex flex-row gap-4 pb-2 overflow-x-auto' >
                {shopsInMyCity?.map((value, index) => <CategoryCard name={shopsInMyCity?.name} imageUrl={shopsInMyCity?.image} key={index} />)}
              </div>
              {
                rightShop && <button onClick={() => scrollRight(shopRef)} className='absolute right-2 z-10 top-1/2 shadow-xl cursor-pointer -translate-y-1/2 rounded-full p-1 bg-[#ff4d2d]'>
                  <FaChevronCircleRight className='text-white' size={15} />
                </button>
              }
            </div>

        }
        <h1 className='text-gray-800 text-2xl sm:text-3xl' >Suggetsed Food Items</h1>






      </div>
    </div>
  )
}

export default UserDashBoard

