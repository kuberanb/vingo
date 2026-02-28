
import React from 'react'
import UserDashBoard from '../components/UserDashBoard';
import OwnerDashBoard from '../components/OwnerDashBoard';
import DeliveryBoyDashBoard from '../components/DeliveryBoyDashBoard';
import { useSelector } from 'react-redux';

function Home() {
    const userData = useSelector((state) => state.user.userData);

    return (
        <div className='w-full min-h-full pt-25 flex flex-col items-center bg-[#fff9f6] ' >
            {userData?.role == "user" && <UserDashBoard />}
            {userData?.role == "owner" && <OwnerDashBoard />}
            {userData?.role == "deliveryBoy" && <DeliveryBoyDashBoard />}
        </div>
    )
}

export default Home