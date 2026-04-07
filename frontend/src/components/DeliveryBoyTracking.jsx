
import React from 'react'
import home from "../assets/home.png"
import scooter from "../assets/scooter.png"
import L from "leaflet";
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, useMap, Popup, Polyline   } from "react-leaflet";

const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40],

});

function DeliveryBoyTracking({ data }) {

    const deliveryBoyLat = data.deliveryBoyLocation.lat;
    const delieveryBoyLon = data.deliveryBoyLocation.lon;


    const customerLat = data.customerLocation.lat;
    const customerLon = data.customerLocation.lon;

    const path = [
        [deliveryBoyLat, delieveryBoyLon],
        [customerLat, customerLon]
    ];

    const center = [deliveryBoyLat, delieveryBoyLon];


    return (
        <div className='w-full h-100 mt-3 rounded-xl overflow-hidden shadow-md '>
            <MapContainer
                center={center}
                zoom={16}
                className="h-full w-full"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[deliveryBoyLat, delieveryBoyLon]} icon={deliveryBoyIcon}  >
                    <Popup >Delivery Boy</Popup >
                </Marker>
                <Marker position={[customerLat, customerLon]} icon={customerIcon}  >
                    <Popup >Customer</Popup >
                </Marker>

                <Polyline positions={path} weight={4} color='blue' />

            </MapContainer>

        </div>
    )
}

export default DeliveryBoyTracking