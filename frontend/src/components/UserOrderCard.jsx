

import React from 'react'

function UserOrderCard({ data }) {
  function formatDateTime(isoDate) {
    const date = new Date(isoDate);

    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return `${formattedDate} ${formattedTime}`;
  }



  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <div className='w-full flex flex-col'>

        {/* Top section */}
        <div className='flex justify-between mb-1' >
          <div className='font-semibold text-black text-lg '>
            order #${data._id.slice(-5)}
          </div>
          <div className='text-gray-600'>
            {data.paymentMethod.toUpperCase()}
          </div>
        </div>
        <div className='flex justify-start mb-1' >
          <div className=' text-gray-600 '>
            Date: {formatDateTime(data.createdAt)}
          </div>
        </div>
        <hr className='mb-2' />
        {/* Each shop */}
        {
          data.shopOrder.map((shopOrder, index) => {

            return (<div key={index} className='flex flex-col  bg-[#fff9f6] mb-4 p-4'>

              <h2 className='text-gray-600 font-semibold mb-1'>{shopOrder.shop.name}</h2>

              <div className='rounded-lg w-full mb-4  '>
                <div className='flex gap-x-4'>
                  {/* Each Item */}
                  {shopOrder.shopOrderItems.map((data, index) => {
                    return (
                      <div key={index} className='w-50 h-full border rounded-xl flex flex-col p-2 items-start '>
                        <img src={data.item.image} alt="" className='w-50 h-30 object-cover overflow-hidden rounded-t-xl ' />

                        <p className='font-semibold  '>{data.item.name}</p>
                        <p className=' text-gray-600 text-sm '>Qty :{data.quantity} * ₹{data.price}</p>

                      </div>
                    )
                  })}
                </div>


              </div>
              <hr className='mb-2' />
              <div className='flex justify-between '>
                <h2 className='font-semibold text-black'>Subtotal : ₹{shopOrder.subTotal}</h2>
                <p className='text-blue-500 text-sm font-semibold'>{shopOrder.status}</p>

              </div>

            </div>)

          },

          )

        }
        <hr className='text-black mb-2' />
        <div className='flex justify-between font-semibold items-center'>
          <div>Total : ₹{data.totalAmount}</div>
          <button className=' text-white font-bold shadow-2xs bg-[#ff4d2d] rounded-md px-4 py-1 transition-transform duration-200 hover:scale-105 cursor-pointer'>Track Order</button>


        </div>

      </div>
    </div>
  )
}

export default UserOrderCard