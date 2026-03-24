
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
    const [addressInput, setAddressInput] = useState('');

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

    return (
        <div className='w-full min-h-screen bg-[#fff9f6]'>
            <IoIosArrowRoundBack onClick={() => navigate("/")} size={30} className='text-[#ff4d2d] cursor-pointer' />
            <div className='flex items-center justify-center min-h-screen w-full'>

                <div className=' w-full md:max-w-lg shadow bg-white rounded-xl p-4  ' >
                    <h1 className='text-black font-semibold text-xl mb-2'>
                        Checkout
                    </h1>
                    <div className='flex gap-2 justify-start items-center mb-2'>
                        <MdLocationOn size={20} className='text-[#ff4d2d]' />
                        <div className='text-black font-semibold'>Delivery Location</div>

                    </div>
                    
                    <section>


                        <div onClick={getLatLngByAddress} className='flex items-center justify-center gap-2 mb-2'>
                            <input
                                onChange={(e) => setAddressInput(e.target.value)} value={addressInput} className=" w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 h-8" />                        <div className='flex items-center justify-center border border-transparent rounded-lg bg-[#ff4d2d] hover:border cursor-pointer h-8 w-8 transition duration-300 hover:border-black'>
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

                    </section>

                </div>
            </div>
        </div>
    )
}

export default CheckOutPage

