import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

function TrackOrderPage() {
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState(null);
    const navigate = useNavigate();
    const { socket } = useSelector(state => state.user);
    const [liveLocations, setLiveLocations] = useState({});

    const handleGetOrder = async () => {
        try {
            const response = await axios.get(
                `${serverUrl}/api/order/get-order-by-id/${orderId}`,
                { withCredentials: true }
            );

            console.log(response.data);
            setCurrentOrder(response.data);
        } catch (error) {
            console.log("handleGetOrder error :", error);
        }
    };


    useEffect(() => {
        socket?.on('updateDeliveryLocation', ({ deliveryBoyId, lattitude, longitude }) => {
            setLiveLocations(prev => ({
                ...prev,
                [deliveryBoyId]: { lat: lattitude, lon: longitude }
            }));
        })

        return () => {
            socket?.off('updateDeliveryLocation')
        };

    }, [socket]);

    useEffect(() => {
        handleGetOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    return (
        <div className="w-full min-h-screen bg-[#fafafa]">

            {/* AppBar */}
            <div className="w-full h-14 bg-[#fff9f6] flex items-center justify-center relative">

                <IoIosArrowRoundBack
                    onClick={() => navigate("/my-orders")}
                    size={34}
                    className="absolute left-4 text-[#ff4d2d] cursor-pointer"
                />

                <h1 className="text-lg font-semibold">
                    Track Order
                </h1>

            </div>

            {/* Body */}
            <div className="max-w-3xl mx-auto w-full p-4 flex flex-col gap-6">

                {currentOrder?.shopOrder?.map((shopOrder, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-3"
                    >

                        <p className="text-lg font-bold text-[#ff4d2d]">
                            {shopOrder.shop.name}
                        </p>

                        <p className="font-semibold">
                            <span>Items: </span>
                            {shopOrder.shopOrderItems
                                ?.map((i) => i.item.name)
                                .join(", ")}
                        </p>

                        <p>
                            <span className="font-semibold">Subtotal: </span>
                            ₹{shopOrder.subTotal}
                        </p>

                        <p>
                            <span className="font-semibold">Delivery Address: </span>
                            {currentOrder?.deliveryAddress?.text}
                        </p>

                        {shopOrder.status !== "delivered" ? (
                            <>

                                {shopOrder.assignedDeliveryBoy ? (
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold">
                                            <span>Delivery Boy Name: </span> {shopOrder.assignedDeliveryBoy.fullName}
                                        </p>
                                        <p className="">
                                            <span>Delivery Boy Contact: </span>  {shopOrder.assignedDeliveryBoy.mobile}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="font-semibold">
                                        Delivery Boy is not assigned yet
                                    </p>
                                )}

                                {
                                    shopOrder.assignedDeliveryBoy &&
                                    <div className="h-100 w-full rounded-2xl  shadow-md">

                                        <DeliveryBoyTracking data={{
                                            deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                                lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                                lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                                            },
                                            customerLocation: {
                                                lat: currentOrder.deliveryAddress.lattitude,
                                                lon: currentOrder.deliveryAddress.longitude
                                            }
                                        }} />

                                    </div>
                                }
                            </>
                        ) : (
                            <p className="text-green-600 font-semibold text-lg">
                                Delivered
                            </p>
                        )}

                    </div>
                ))}

            </div>

        </div>
    );
}

export default TrackOrderPage;
