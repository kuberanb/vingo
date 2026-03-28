
import React from 'react'
import { FaPhoneAlt } from "react-icons/fa";

function OwnerOrderCard({ data }) {
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-1 flex flex-col items-start' >
      <h1 className='text-black font-semibold text-xl' >
        {data.user.fullName}
      </h1>
      <p className='text-gray-600  text-sm' >{data.user.email}</p>

      <div className='flex flex-row gap-2 justify-start items-center'>
        <FaPhoneAlt className='text-gray-600' />
        <div className='text-gray-600'>
          {data.user?.mobile}
        </div>
      </div>
      <p className='text-gray-600 text-md font-semibold '>{data.deliveryAddress.text}</p>
      <p className='text-gray-600 text-sm mb-1'>Lat : {data.deliveryAddress.lattitude} Lon : {data.deliveryAddress.longitude}</p>

      <div className='flex gap-2 mb-2'>
        {
          data.shopOrder[0].shopOrderItems.map((item, index) => {
            return (
              <div key={index} className='w-50 h-full border rounded-xl flex flex-col p-2 items-start '>
                <img src={item.item?.image} alt={item.item?.name} className='w-50 h-30 object-cover overflow-hidden rounded-t-xl ' />
                <p className='font-semibold  '>{item.item?.name}</p>
                <p className=' text-gray-600 text-sm '>Qty: {item.quantity} * ₹{item.price}</p>
              </div>
            )
          })
        }
      </div>
      <div className='flex w-full flex-row justify-between mb-2'>
        <div className='font-semibold'>status: <span className='text-[#ff4d2d]'>{data.shopOrder[0].status}</span></div>
        <select
          className="border border-[#ff4d2d] text-[#ff4d2d] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#ff4d2d]"
          defaultValue="pending"
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out_of_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <hr className=' mb-2 ' />
      <div className='flex justify-end w-full'>
        <div className='mb-2 text-black font-bold'>Total : <span>₹{data.totalAmount}</span></div>
      </div>
    </div>
  )
}

export default OwnerOrderCard