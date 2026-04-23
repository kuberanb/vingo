
import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useState } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'

function DeliveryBoyDashBoard() {

    const { userData, socket } = useSelector((state) => state.user)
    const [availableAssignments, setAvailableAssignments] = useState([]);
    const [currentOrder, setCurrentOrder] = useState();
    const [showOtpBox, setShowOtpBox] = useState(false);
    const [otp, setOtp] = useState("");

    const getAssignments = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true });
            console.log(result.data);
            setAvailableAssignments(result.data);
        } catch (e) {
            console.log(`getAssignments error : ${e}`);
        }
    }

    const acceptOrder = async (assignmentId) => {
        try {

            const response = await axios.post(`${serverUrl}/api/order/accept-order/${assignmentId}`, {}, { withCredentials: true });
            console.log(response.data);
            await getCurrentOrder();
            getAssignments();

        } catch (error) {
            console.log(`accept order error : ${error}`);
        }

    }

    const getCurrentOrder = async () => {

        try {
            const response = await axios.get(`${serverUrl}/api/order/get-current-order/`, { withCredentials: true });
            console.log(response.data);
            setCurrentOrder(response.data);
        } catch (error) {
            console.log(`get current order error : ${error}`);

        }
    }


    async function sendOtp() {

        try {
            const response = await axios.post(`${serverUrl}/api/order/send-delivery-otp/`, { orderId: currentOrder._id, shopId: currentOrder.shopOrder.shop._id }, { withCredentials: true });
            console.log(`sendOtp response`, response.data);
            setShowOtpBox(true);

        } catch (error) {
            console.log(`sendOtp error : `, error);
        }

    }


    async function verifyOtp() {

        try {
            const response = await axios.post(`${serverUrl}/api/order/verify-delivery-otp/`, { orderId: currentOrder._id, shopId: currentOrder.shopOrder.shop._id, otp }, { withCredentials: true });
            console.log(`verifyOtp response`, response.data);

        } catch (error) {
            console.log(`verifyOtp error : `, error);

        }

    }


    useEffect(() => {

        socket?.on('newAssignment', (data) => {
            if (data.sentTo === userData._id) {
                setAvailableAssignments(prev => [...prev, data])
            }
        });

        return () => {
            socket?.off('newAssignment')
        }

    }, [socket]);


    useEffect(() => {

        getAssignments();
        getCurrentOrder();


    }, [userData]);

    const currentShopName = currentOrder?.shopOrder?.shop?.name || 'Shop';


    return (
        <div className='flex flex-col w-full min-h-screen gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
            <Nav />
            <div className='w-full max-w-2xl flex flex-col gap-5 items-start p-2.5 ' >
                <div className='w-full shadow rounded-xl px-2 py-2 flex flex-col items-center justify-center gap-2 bg-white mb-2 text-center'>
                    <div className='font-semibold text-2xl text-[#ff4d2d]'>Welcome, {userData.fullName}</div>
                    <div className='font-semibold text-xs text-[#ff4d2d]'>Lattitude :  <span className=' font-semibold'>{userData.location.coordinates[1]}</span>  Longitude : <span className='font-semibold'>{userData.location.coordinates[0]}</span></div>
                </div>

                {!currentOrder && <div className='w-full shadow rounded-xl px-4 py-4 flex flex-col items-start justify-center gap-2 bg-white mb-2'>
                    <h1 className='text-lg font-bold mb-4 flex items-center gap-2  '>Available Orders</h1>

                    <div className="space-y-4 w-full">
                        {availableAssignments.length > 0 ? (
                            availableAssignments.map((a, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 flex flex-col items-center text-center sm:flex-row sm:justify-between sm:items-center sm:text-left w-full gap-3"
                                    >
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-black">{a.shopName}</div>
                                            <div className="text-xs text-gray-700">{a.deliveryAddress.text}</div>
                                            <div className="text-xs text-gray-900">
                                                {a.items.length} items | ₹{a.subTotal}
                                            </div>
                                        </div>

                                        <button onClick={() => acceptOrder(a.assignmentId)}
                                            className="px-4 py-2 rounded-lg bg-[#ff4d2d] text-white font-semibold
                 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-gray-800 text-[12px]">No Available Orders</div>
                        )}
                    </div>
                </div>
                }

                {currentOrder && <div className='w-full shadow rounded-xl px-4 py-4 flex flex-col items-start justify-center gap-2 bg-white mb-2' >
                    <h2 className='text-lg mb-3 font-bold'>Current Order</h2>
                    <div className='border rounded-lg p-4 mb-3'>
                        <p className='font-semibold text-sm'>{currentShopName}</p>
                        <p className='text-sm text-gray-500' >{currentOrder.deliveryAddress.text}</p>
                        <p className='text-xs text-gray-400'>{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subTotal}</p>
                    </div>

                    <DeliveryBoyTracking data={currentOrder} />
                    {
                        !showOtpBox ? <button onClick={sendOtp} className='mt-4 w-full cursor-pointer bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' >
                            Mark as Delivered
                        </button> : <div className='mt-4 p-4 border rounded-xl bg-gray-50 w-full font-semibold flex flex-col gap-2'>
                            <p>Enter Otp Sent to : <span className='text-orange-500'> {currentOrder.user.fullName}</span> </p>
                            <input value={otp} maxLength={6}
                                onChange={(e) => setOtp(e.target.value)} className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' type="text" placeholder='Enter Otp' />
                            <button onClick={verifyOtp} className='w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all' >Submit Otp</button>
                        </div>
                    }

                </div>
                }

            </div>
        </div >
    )
}

export default DeliveryBoyDashBoard
