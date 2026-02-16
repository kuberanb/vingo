
import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'

export const serverUrl = "http://localhost:8000";

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignUp />}></Route>
      <Route path='/signup' element={<SignUp />} ></Route>
      <Route path='/signIn' element={<SignIn />} ></Route>
    </Routes>
  )
}


export default App
