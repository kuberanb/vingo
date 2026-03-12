import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import CategoryCard from './CategoryCard'
import { categories } from '../category'
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";

function UserDashBoard() {
  const [leftButton, showLeftButton] = useState(false);
  const [rightButton, showRightButton] = useState(false);
  const scrollRef = useRef(null);

  function scrollLeft() {
    scrollRef.current.scrollBy({
      left: -200,
      behavior: "smooth"
    });

  }

  function scrollRight() {
    scrollRef.current.scrollBy({
      left: 200,
      behavior: "smooth"
    })

  }

  function checkScroll() {
    const el = scrollRef.current;

    showLeftButton(el.scrollLeft > 0);
    showRightButton(el.scrollLeft < el.scrollWidth - el.clientWidth);
  }

  useEffect(() => {
    checkScroll();
  }, [scrollRef]);



  return (
    <div className=' flex flex-col w-full min-h-screen gap-5 items-center bg-[#fff9f6] '>
      <Nav />
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-2.5'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl' >Inspiration for your first order</h1>

        <div className='w-full relative'>

          {
            leftButton &&
            <button onClick={scrollLeft} className='absolute left-2 z-10 top-1/2 rounded-full p-1 bg-[#ff4d2d] -translate-y-1/2  shadow-xl cursor-pointer'>
              <FaChevronCircleLeft className='text-white ' size={15} />
            </button>

          }

          <div ref={scrollRef} onScroll={checkScroll}
            className='w-full flex flex-row gap-4 pb-2 overflow-x-auto' >
            {categories.map((value, index) => <CategoryCard category={value} key={index} />)}
          </div>

          {
            rightButton && <button onClick={scrollRight} className='absolute right-2 z-10 top-1/2 shadow-xl cursor-pointer -translate-y-1/2 rounded-full p-1 bg-[#ff4d2d]'>
              <FaChevronCircleRight className='text-white' size={15} />
            </button>
          }

        </div>
      </div>
    </div>
  )
}

export default UserDashBoard

