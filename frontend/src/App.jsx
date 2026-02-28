
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

export const serverUrl = "http://localhost:8000";

function App() {
  useGetCurentUser();
  useGetCurrentCity();
  const userData = useSelector((state) => state.user.userData);


  return (

    <Routes>
      <Route path='/' element={!userData ? <SignUp /> : <Home />}></Route>
      <Route path='/signup' element={!userData ? <SignUp /> : <Home />} ></Route>
      <Route path='/signIn' element={!userData ? <SignIn /> : <Home />} ></Route>
      <Route path='forgot-password' element={!userData ? <ForgotPassword /> : <Home />} ></Route>
    </Routes>

  )
}


export default App
