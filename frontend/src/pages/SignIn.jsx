
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { serverUrl } from '../App';

function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signIn = async (params) => {

    try {
      await axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withcredentials: true });
    } catch (error) {
      console.log(`Error SignIn : ${error.response.data.message}`);
    }

  }



  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{ backgroundColor: bgColor }} >
      <div className=' shadow-lg p-8 max-w-md rounded-xl bg-white border w-full ' style={{ border: `1px solid ${borderColor}` }} >
        <h1 className=' text-3xl font-bold mb-2 ' style={{ color: primaryColor }}>
          Vingo
        </h1>
        <p className='text-gray-600 mb-8' style={{}}>Create your account to get started with delicious food deliveries</p>

        {/* Email */}
        <div className='mb-4'>
          <label htmlFor="email" className='font-medium mb-1'>Email</label>
          <input id='email' onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder='Enter your Email' className='w-full rounded-md px-3 py-1.5 text-sm placeholder:text-xs  ' style={{ border: `1px solid ${borderColor}` }} />
        </div>
        {/* Password */}
        <div className='mb-4'>
          <label htmlFor="password" className='font-medium mb-1'>Password</label>

          <div className='relative'>
            <input id='password' onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} placeholder='Enter your Password' className='w-full rounded-md px-3 py-1.5 text-sm relative placeholder:text-xs   ' style={{ border: `1px solid ${borderColor}` }} />
            <button className='absolute right-3 top-1/4 cursor-pointer  text-gray-500' onClick={() => setShowPassword(prev => !prev)} >{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>

          </div>
        </div>
        {/* Forgot Password */}
        <div className='w-full flex justify-end mb-2 '  >
          <div className=' text-[#ff4d2d] text-sm cursor-pointer ' style={{}} >
            Forgot Password
          </div>

        </div>


        {/* SignUp */}
        <div className="flex items-center justify-center mb-4">
          <button onClick={signIn} className="w-full py-2 px-4 rounded-md font-semibold text-white cursor-pointer bg-[#ff4d2d] hover:bg-[#e64323] transition-colors">
            SignIn
          </button>
        </div>
        {/* Google SignUp */}
        <div className='mb-2'>
          <button className='w-full flex justify-center gap-2 border cursor-pointer border-gray-300 rounded-md py-2 px-4 hover:bg-gray-200 transition-colors' >
            <FcGoogle size={24} className='' />
            <span>SignIn with Google </span>
          </button>
        </div>
        {/* Want to create a new account */}
        <div className='' >
          <p className='text-sm text-center cursor-pointer ' onClick={() => navigate("/signup")} >Want to create a new account? <span className='text-[#ff4d2d] font-semibold' >SignUp</span></p>
        </div>





      </div>
    </div >
  )
}

export default SignIn