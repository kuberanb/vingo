

import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurentUser from './hooks/useGetCurentUser.jsx'
import { useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import useGetCurrentCity from './hooks/useGetCurrentCity.jsx'
import useGetMyShop from './hooks/useGetMyShop.jsx'
import CreateEditShop from './pages/CreateEditShop.jsx'
import AddFoodItem from './pages/AddFoodItem.jsx'
import EditFoodItem from './pages/EditFoodItem.jsx'
import useGetShopByCity from './hooks/useGetShopByCity.jsx'
import useGetItemsByCity from './hooks/useGetItemsByCity.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckOutPage from './pages/CheckOutPage.jsx'
import MyOrders from './pages/MyOrders.jsx'
import OrderSucessPage from './pages/OrderSucessPage.jsx'
import useGetMyOrders from './hooks/useGetMyOrders.jsx'
import useUpdateLocation from './hooks/useUpdateLocation.jsx'
import TrackOrderPage from './pages/TrackOrderPage.jsx'
export const serverUrl = "http://localhost:8000";

function App() {
  useGetCurentUser();
  useUpdateLocation();
  useGetCurrentCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();

  const userData = useSelector((state) => state.user.userData);

  return (
    <Routes>
      <Route path='/' element={!userData ? <SignUp /> : <Home />}></Route>
      <Route path='/signup' element={!userData ? <SignUp /> : <Home />} ></Route>
      <Route path='/signIn' element={!userData ? <SignIn /> : <Home />} ></Route>
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <SignIn />} ></Route>
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <SignIn />} ></Route>
      <Route path='/add-food-item' element={userData ? <AddFoodItem /> : <SignIn />} ></Route>
      <Route path='/edit-food-item/:itemId' element={userData ? <EditFoodItem /> : <SignIn />}    ></Route>
      <Route path='/cart' element={userData ? <CartPage /> : <SignIn />}    ></Route>
      <Route path='/checkout' element={userData ? <CheckOutPage /> : <SignIn />}    ></Route>
      <Route path='/my-orders' element={userData ? <MyOrders /> : <SignIn />}    ></Route>
      <Route path='/order-sucess' element={userData ? <OrderSucessPage /> : <SignIn />}    ></Route>
      <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <SignIn />}    ></Route>
    </Routes>
  )
}


export default App
