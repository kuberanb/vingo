import React from 'react'
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const  itemId  = data._id;


    const handleDelete = async () => {
        try {

            let response = await axios.delete(`${serverUrl}/api/item/item/${itemId}`, { withCredentials: true });

            dispatch(setMyShopData(response.data.shop));

        } catch (error) {
            console.log(`handleDelete exception : ${error}`);
        }

    }

    return (

        <div className="flex w-[80%] max-w-lg  border rounded-lg border-brand-primary bg-white shadow-lg overflow-hidden mb-2">

            <div className='  w-27.5  shrink-0 '>
                <img src={data.image} alt="Item Image" className='h-full w-full object-cover rounded-l-lg ' />
            </div   >
            <div className='flex flex-col justify-start px-2 py-2  flex-1 min-w-0'>

                <div className='text-brand-primary font-semibold truncate'>{data.name}</div>
                <div className="text-sm">
                    <span className="font-semibold text-gray-800 ">Category:</span> {data.category}
                </div>

                <div className="text-sm">
                    <span className="font-semibold text-gray-800 truncate">Food Type: </span> {data.foodType}
                </div>

                <div className='flex justify-between items-center'>
                    <div className='flex'>₹ {data.price}</div>

                    <div className=' flex gap-2'>
                        <MdOutlineEdit onClick={() => navigate(`/edit-food-item/${data._id}`)} size={25} className='text-brand-primary  cursor-pointer hover:bg-gray-100 p-0.5 rounded-full' />
                        <MdDeleteOutline onClick={handleDelete} size={25} className='text-brand-primary  cursor-pointer hover:bg-gray-100 p-0.5 rounded-full' />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default OwnerItemCard