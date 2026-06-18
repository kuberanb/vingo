import axios from "axios";
import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { updateOrderStatus } from "../redux/userSlice";

function OwnerOrderCard({ data }) {
  const dispatch = useDispatch();
  const [availableBoys, setAvailableBoys] = useState([]);
  const [deliveryStatusMessage, setDeliveryStatusMessage] = useState("");
  const shopOrder = data.shopOrder?.[0];

  if (!shopOrder) {
    return null;
  }

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const repsonse = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true },
      );

      console.log("ghhhg : ", repsonse.data);

      setAvailableBoys(
        Array.isArray(repsonse.data.availableBoys)
          ? repsonse.data.availableBoys
          : [],
      );
      setDeliveryStatusMessage(repsonse.data.message || "");
      dispatch(
        updateOrderStatus({
          orderId,
          shopId,
          shopOrder: repsonse.data.shopOrder,
          status: repsonse.data.shopOrder?.status || status,
        }),
      );
    } catch (error) {
      console.log(`handleUpdateStatus error ${error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-1 flex flex-col items-start">
      <h1 className="text-black font-semibold text-xl">{data.user.fullName}</h1>
      <p className="text-gray-600  text-sm">{data.user.email}</p>

      <div className="flex flex-row gap-2 justify-start items-center">
        <FaPhoneAlt className="text-gray-600" />
        <div className="text-gray-600">{data.user?.mobile}</div>
      </div>
      {data.paymentMethod === "online" ? (
        <>
          <p>Payment: {data.payment ? "True" : "False"}</p>
          <p>Payment Method: {data.paymentMethod}</p>
        </>
      ) : (
        <p>Payment Method: {data.paymentMethod}</p>
      )}
      <p className="text-gray-600 text-md font-semibold ">
        {data.deliveryAddress.text}
      </p>


      <p className="text-gray-600 text-sm mb-1">
        Lat : {data.deliveryAddress.lattitude} Lon :{" "}
        {data.deliveryAddress.longitude}
      </p>

      <div className="flex gap-2 mb-2">
        {shopOrder.shopOrderItems.map((item, index) => {
          return (
            <div
              key={index}
              className="w-50 h-full border rounded-xl flex flex-col p-2 items-start "
            >
              <img
                src={item.item?.image}
                alt={item.item?.name}
                className="w-50 h-30 object-cover overflow-hidden rounded-t-xl "
              />
              <p className="font-semibold  ">{item.item?.name}</p>
              <p className=" text-gray-600 text-sm ">
                Qty: {item.quantity} * &#8377;{item.price}
              </p>
            </div>
          );
        })}
      </div>
      {shopOrder.status === "out of delivery" && (
        <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50 w-full">
          {shopOrder.assignedDeliveryBoy ? (
            <p>Assigned Delivery Boy :</p>
          ) : availableBoys.length > 0 ? (
            <p>Available Delivery Boys :</p>
          ) : (
            <p>Delivery Assignment :</p>
          )}
          {shopOrder.assignedDeliveryBoy ? (
            <div className="text-gray-600">
              {shopOrder.assignedDeliveryBoy.fullName}
              {shopOrder.assignedDeliveryBoy.mobile
                ? ` - ${shopOrder.assignedDeliveryBoy.mobile}`
                : ""}
            </div>
          ) : availableBoys.length > 0 ? (
            <div>
              {availableBoys.map((b, index) => (
                <div key={index} className="text-gray-600">
                  {b.fullName}-{b.mobile}
                </div>
              ))}
            </div>
          ) : (
            <div>Waiting for delivery boys to accept</div>
          )}
          {deliveryStatusMessage && (
            <p className="mt-2 text-gray-600">{deliveryStatusMessage}</p>
          )}
        </div>
      )}

      <div className="flex w-full flex-row justify-between mb-2">
        <div className="font-semibold">
          status: <span className="text-brand-primary">{shopOrder.status}</span>
        </div>
        <select
          className="border border-brand-primary text-brand-primary rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          value={shopOrder.status}
          onChange={(e) => {
            handleUpdateStatus(data._id, shopOrder.shop._id, e.target.value);
          }}
        >
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out for Delivery</option>
        </select>
      </div>
      <hr className=" mb-2 " />
      <div className="flex justify-end w-full">
        <div className="mb-2 text-black font-bold">
          Total : <span>&#8377;{shopOrder.subTotal}</span>
        </div>
      </div>
    </div>
  );
}

export default OwnerOrderCard;
