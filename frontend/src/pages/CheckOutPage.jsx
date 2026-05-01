
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useState } from 'react';
import { useEffect } from 'react';
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import { MdOutlineTwoWheeler } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { addMyOrder, clearCart } from '../redux/userSlice';

function RecenterMap({ location }) {
    const map = useMap();


    useEffect(() => {
        if (location?.lat && location?.long) {
            map.setView([location.lat, location.long], 16, { animate: true });
        }
    }, [location, map]);
    return null;

}

function CheckOutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { location, address } = useSelector((state) => state.map);
    const { cartItems, totalAmount } = useSelector((state) => state.user);
    const [addressInput, setAddressInput] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    const onDragEnd = (e) => {
        console.log(e.target.getLatLng())
        const { lat, lng } = e.target.getLatLng()
        dispatch(setLocation({ lat: lat, long: lng }));
        getAddressByLatLng(lat, lng)
    }

    const getAddressByLatLng = async (lat, lng) => {
        try {
            let response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
            console.log("setCurrentCity data:", response.data.results[0].formatted);
            dispatch(setAddress(response.data.results[0].formatted));

        } catch (error) {
            console.log(error);
        }
    }


    const getCurrentLocation = async () => {

        try {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lattitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                dispatch(setLocation({ lat: lattitude, long: longitude }));
                getAddressByLatLng(lattitude, longitude);
            });

        } catch (error) {
            console.log(`Error getting location`, error);
        }
    }


    const getLatLngByAddress = async () => {

        try {
            let response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
            const lat = response.data.features[0].properties.lat;
            const long = response.data.features[0].properties.lon;
            dispatch(setLocation({ lat, long }))

        } catch (error) {
            console.log(`getLatLngByAddress error : `, error);

        }


    }


    useEffect(() => {
        setAddressInput(address);

    }, [address]);


    const subTotal = totalAmount;
    const deliveryFree = totalAmount > 500 ? 0 : 40;
    const totalAmountWithDeliveryFee = subTotal + deliveryFree;



    const handlePlaceOrder = async () => {

        setLoading(true);

        try {
            const response = await axios.post(`${serverUrl}/api/order/place-order`, {
                paymentMethod: paymentMethod,
                deliveryAddress: {
                    text: addressInput,
                    lattitude: location?.lat,
                    longitude: location?.long
                },
                cartItems: cartItems,
                totalAmount: totalAmountWithDeliveryFee,
            }, { withCredentials: true });

            console.log(`handlePlaceOrder response : ${response}  `)

            if (paymentMethod == "cod") {
                dispatch(addMyOrder(response.data))
                navigate('/order-sucess')
            } else {

                const orderId = response.data.orderId
                const razorOrder = response.data.razorOrder

                openRazorPayWindow(orderId, razorOrder)

            }



            dispatch(clearCart());

        } catch (error) {
            console.log(`place order error : ${error}`);
        } finally {
            setLoading(false);


        }
    }


    const openRazorPayWindow = (orderId, razorOrder) => {

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorOrder.amount,
            currency: "INR",
            name: "Vingo",
            description: "Food Delivery Website",
            order_id: razorOrder.id,
            handler: async (response) => {

                try {

                    const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderId: orderId
                    }, { withCredentials: true })

                    dispatch(addMyOrder(response.data))
                    navigate('/order-sucess')


                } catch (error) {
                    console.log('verify payment error : ', error)
                }
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()

    }

    return (
        <div className='w-full min-h-screen bg-[#fff9f6]'>
            <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />
            <div className='flex items-center justify-center min-h-screen w-full'>

                <div className=' w-full md:max-w-xl shadow bg-white rounded-xl p-4  ' >
                    <h2 className='text-black font-semibold text-xl mb-2'>
                        Checkout
                    </h2>
                    <section>

                        <div className='flex gap-2 justify-start items-center mb-2'>
                            <MdLocationOn size={20} className='text-[#ff4d2d]' />
                            <div className='text-black font-semibold'>Delivery Location</div>

                        </div>


                        <div onClick={getLatLngByAddress} className='flex items-center justify-center gap-2 mb-2'>
                            <input
                                onChange={(e) => setAddressInput(e.target.value)} value={addressInput} className=" w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 h-8" />
                            <div className='flex items-center justify-center border border-transparent rounded-lg bg-[#ff4d2d] hover:border cursor-pointer h-8 w-8 transition duration-300 hover:border-black'>
                                <FaSearch className='text-white' size={18} />
                            </div>
                            <div onClick={getCurrentLocation} className='flex items-center justify-center border border-transparent  rounded-lg bg-blue-500 cursor-pointer hover:border transition duration-300 h-8 w-8 hover:border-black'>
                                <FaLocationCrosshairs className='text-white' size={18} />
                            </div>
                        </div>

                        <div className='rounded-xl border overflow-hidden'  >
                            <div className='h-64 w-full flex items-center justify-center'>
                                {location?.lat && location?.long && (
                                    <MapContainer
                                        center={[location.lat, location.long]}
                                        zoom={16}
                                        className="h-full w-full"
                                    >
                                        <TileLayer
                                            attribution="&copy; OpenStreetMap contributors"
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <RecenterMap location={location} />

                                        <Marker position={[location.lat, location.long]} draggable eventHandlers={{ dragend: onDragEnd }} />
                                    </MapContainer>
                                )}

                            </div>

                        </div>

                    </section>
                    <section>
                        <h2 className='text-black font-semibold mb-2'>
                            Payment Method
                        </h2>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div onClick={() => setPaymentMethod('cod')} className={` flex justify-start items-center gap-4 border rounded-xl px-3 py-0.5  ${paymentMethod === "cod" ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300  '} `}>
                                <div className='rounded-full bg-green-100 w-10 h-10 flex items-center justify-center'>
                                    <MdOutlineTwoWheeler className='text-green-600 ' size={18} />
                                </div>
                                <div className='flex flex-col '>
                                    <p className='text-black text-[14px] font-bold'>Cash On Delivery</p>
                                    <p className='text-sm text-[12px] text-gray-500'>Pay when your food arrives</p>
                                </div>
                            </div>

                            <div onClick={() => setPaymentMethod('online')} className={`flex justify-start items-center gap-4 border rounded-xl px-3 py-0.5 cursor-pointer transition ${paymentMethod === "online" ? 'border-violet-500 bg-violet-50' : 'border-gray-200 bg-white hover:border-violet-300'} `}>
                                <div className=' flex  gap-1 items-center'>
                                    <div className='rounded-full bg-violet-100 w-10 h-10 flex items-center justify-center'>
                                        <FaMobileAlt className='text-violet-600' size={18} />
                                    </div>
                                    <div className='rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center'>
                                        <FaCreditCard className='text-blue-600' size={18} />
                                    </div>
                                </div>

                                <div className='flex flex-col flex-1'>
                                    <p className='text-black text-[14px] font-bold'>UPI/Credit/Debit Card</p>
                                    <p className='text-sm text-[12px] text-gray-500'>Pay securely online</p>
                                </div>

                            </div>
                        </div>

                    </section>
                    <section className='mb-2' >
                        <h2 className='text-black font-semibold  mb-2 '>
                            Order Summary
                        </h2>

                        <div className='rounded-xl border border-gray-300 px-2 py-2 shadow-xs bg-gray-50'>
                            {cartItems.map((item, index) => (<div key={index} className='flex justify-between  mb-2'>

                                <p className='font-semibold '>{item.name} * {item.quantity}</p>
                                <p className='  '> ₹{item.price * item.quantity}</p>
                            </div>))}
                            <hr className='text-gray-100' />

                            <div className='mb-2 flex justify-between'>
                                <p className='font-semibold '>SubTotal</p>
                                <p className='  '> ₹ {subTotal}</p>

                            </div>
                            <hr className='text-gray-100' />

                            <div className='mb-2 flex justify-between'>
                                <p className='font-semibold'>Delivery Fee</p>
                                <span>{deliveryFree === 0 ? "Free" : `₹ ${deliveryFree}`}</span>
                            </div>
                            <hr className='text-gray-100' />
                            <div className='mb-2 flex justify-between'>
                                <p className='font-semibold '>Total Amount</p>
                                <span className='text-[#ff4d2d] font-bold'>₹ {totalAmountWithDeliveryFee}</span>
                            </div>
                        </div>
                    </section>
                    <div className='w-full flex justify-center mb-2'>
                        <button onClick={handlePlaceOrder} disabled={loading} className=' w-full text-white font-bold shadow-2xs bg-[#ff4d2d] rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105 cursor-pointer'>

                            {
                                loading ? <ClipLoader size={20} color="#fff" /> :
                                    (paymentMethod === "cod" ? "Place Order" : "Pay & Place Order")
                            }

                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CheckOutPage

