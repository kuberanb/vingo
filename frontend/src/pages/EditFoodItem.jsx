import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setMyShopData } from '../redux/ownerSlice.js';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';
import { serverUrl } from '../App.jsx';



function EditFoodItem() {
  const navigate = useNavigate();
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);
  const { itemId } = useParams();



  useEffect(() => {

    async function getItem() {

      try {
        let response = await axios.get(`${serverUrl}/api/item/get-item/${itemId}`, { withCredentials: true });

        const item = response.data.item;

        setName(item.name);
        setPrice(item.price);
        setCategory(item.category);
        setFoodType(item.foodType);
        setFrontendImage(item.image);

      } catch (error) {
        console.log(` getItem Exception :  ${error?.message} `);
      }



    }

    getItem()
  }, [itemId])



  const categories = ["Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chineese",
    "Fast Food",
    "Others",];

  const foodTypes = [
    "Veg", "Non-Veg"

  ];



  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      if (backendImage) {
        formData.append("image", backendImage)
      }


      const response = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true });

      dispatch(setMyShopData(response.data.shop));
      navigate('/');
      console.log("handleSubmit in Edit Food Item:", response.data);

    } catch (e) {

      console.log(`error : ${e}`);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className='flex flex-col   w-full min-h-screen bg-[#fff9f6]'>
      <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />

      <div className=' flex items-center justify-center min-h-screen w-full  '>
        <div className='text-center max-w-lg md:max-w-md shadow-lg rounded-2xl p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center  '>
          <div className="flex items-center justify-center p-4 rounded-full bg-[#ff4d2d]/10 mb-2 ">
            <FaUtensils size={60} className="text-[#ff4d2d]" />
          </div>

          <div className=' font-black text-lg mb-2 '>
            Edit Food Item
          </div>

          <form onSubmit={handleSubmit} action="" >
            <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
              <label htmlFor="name" className=' text-sm font-semibold ' >Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter shop name ' type="text" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full text-md' />
            </div>

            <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
              <label htmlFor="shopImage" className='  text-sm font-semibold ' >Food Image</label>
              <input type="file" onChange={handleImage} className='w-full rounded-lg text-md cursor-pointer border px-2 py-1 hover:ring-0.5 bg-white hover:bg-gray-200 duration-300' />

              {
                frontendImage && <div className='mt-4'>
                  <img src={frontendImage} alt="" className='h-48 w-full rounded-lg object-cover border ' />
                </div>
              }
            </div>
            <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
              <label htmlFor="name" className=' text-sm font-semibold ' >Price</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder='0' type="number" className='rounded-lg ring-1 duration-300 px-2 py-1 w-full text-md' />
            </div>
            <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
              <label htmlFor="name" className=' text-sm font-semibold ' >Select Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Select Category' className='rounded-lg ring-1 duration-300 px-2 py-1 w-full text-md' >

                <option value="">Select Category</option>
                {categories.map((cate, index) => (
                  <option value={cate} key={index}  >{cate}</option>
                ))}

              </select>

            </div>
            <div className=' w-full flex flex-col items-start gap-1 mb-4 '>
              <label htmlFor="name" className=' text-sm font-semibold ' >Select Category</label>
              <select value={foodType} onChange={(e) => setFoodType(e.target.value)} placeholder='Select Food Type' className='rounded-lg ring-1 duration-300 px-2 py-1 w-full text-md' >

                <option value="">Select Food Type</option>
                {foodTypes.map((foodType, index) => (
                  <option value={foodType} key={index} >{foodType}</option>
                ))}

              </select>

            </div>


            <button disabled={loading}
              type='submit'

              className='bg-[#ff4d2d] w-full text-white px-2 py-1 rounded-lg hover:bg-[#ff4d2d]/80 duration-300 mb-4 cursor-pointer' >
              {
                loading ? <ClipLoader size={20} /> : <div>Save</div>


              }


            </button>
          </form>
        </div>
      </div >
    </div >
  )
}

export default EditFoodItem

