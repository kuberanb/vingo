

import React from 'react'

function CategoryCard({ name, imageUrl, onclick }) {
    return (
        <div onClick={onclick} className='w-30 h-30 md:w-45 md:h-45 rounded-2xl border md:border-2  border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative cursor-pointer '>
            <img className='w-full h-full object-cover transition-transform hover:scale-110  duration-300 ' src={imageUrl} alt={name} />
            <div className='bg-gray-300 backdrop-blur-2xl rounded-xl shadow text-white text-center absolute  bottom-1 p-0.5 px-2 left-1/2 -translate-x-1/2 font-semibold ' >{name}</div>
        </div>
    )
}

export default CategoryCard