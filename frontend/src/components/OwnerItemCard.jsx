import React from 'react'
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

function OwnerItemCard({ data }) {
    return (
        <div className="flex h-27.5 w-[80%] max-w-lg  border rounded-lg border-[#ff4d2d] bg-white shadow-lg overflow-hidden mb-2">

            <div className=' h-27.5 w-27.5  shrink-0 '>
                <img src={data.image} alt="Item Image" className='h-27.5 w-27.5 object-cover rounded-l-lg ' />
            </div   >
            <div className='flex flex-col justify-start px-2 py-2  flex-1 min-w-0'>

                <div className='text-[#ff4d2d] truncate'>{data.name}</div>
                <div className="text-sm">
                    <span className="font-semibold text-gray-800 ">Category:</span> {data.category}
                </div>

                <div className="text-sm">
                    <span className="font-semibold text-gray-800 truncate">Food Type: </span> {data.foodType}
                </div>

                <div className='flex justify-between items-center'>
                    <div className='flex'>₹ {data.price}</div>

                    <div className=' flex gap-2'>
                        <MdOutlineEdit size={25} className='text-[#ff4d2d]  cursor-pointer hover:bg-gray-100 p-0.5 rounded-full' />
                        <MdDeleteOutline size={25} className='text-[#ff4d2d]  cursor-pointer hover:bg-gray-100 p-0.5 rounded-full' />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default OwnerItemCard