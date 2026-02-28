
import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { auth } from '../../firebase.js';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';


function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd"

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        fullName,
        email,
        password,
        mobile,
        role
      }, {
        withCredentials: true
      });
      dispatch(setUserData(result.data));

      console.log("Sign up successful:", result);
      setError("");

    } catch (error) {
      setError(`${error.response.data.message}`);

      console.log("Backend Error:", error.message);
    } finally {
      setLoading(false);
    }



  }

  const handleGoogleAuth = async () => {
    setError("");


    if (!mobile) {
      return setError("Mobile Number is required");
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Make it serializable
    const safeUser = JSON.parse(JSON.stringify(user));

    console.log("Google Sign-In successful. User:", user);


    try {

      let response = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        fullName: user.displayName,
        email: user.email,
        mobile: mobile,
        role: role
      }, {
        withCredentials: true
      });

      dispatch(setUserData(response.data));
      console.log("Google Auth Backend Success");
      setError("");

    } catch (error) {
      setError(`${error.response.data.message}`);

      console.log("Google Auth Backend Error:", error);

    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{ backgroundColor: bgColor }} >
      <div className=' shadow-lg p-8 max-w-md rounded-xl bg-white border w-full ' style={{ border: `1px solid ${borderColor}` }} >
        <h1 className=' text-3xl font-bold mb-2 ' style={{ color: primaryColor }}>
          Vingo
        </h1>
        <p className='text-gray-600 mb-8' style={{}}>Create your account to get started with delicious food deliveries</p>

        {/* Full Name */}
        <div className='mb-4'>
          <label htmlFor="fullName" className='font-medium mb-1'>Full Name</label>
          <input id='fullName' required onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" placeholder='Enter your Full Name' className='w-full rounded-md px-3 py-1.5 text-sm placeholder:text-xs  ' style={{ border: `1px solid ${borderColor}` }} />
        </div>
        {/* Email */}
        <div className='mb-4'>
          <label htmlFor="email" className='font-medium mb-1'>Email</label>
          <input id='email' required onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder='Enter your Email' className='w-full rounded-md px-3 py-1.5 text-sm placeholder:text-xs  ' style={{ border: `1px solid ${borderColor}` }} />
        </div>
        {/* Mobile */}
        <div className='mb-4'>
          <label htmlFor="mobile" className='font-medium mb-1'>Mobile Number</label>
          <input id='mobile' required onChange={(e) => setMobile(e.target.value)} value={mobile} type="text" placeholder='Enter your Mobile Number'
            className='w-full rounded-md px-3 py-1.5 text-sm placeholder:text-xs ' style={{ border: `1px solid ${borderColor}` }} />
        </div>
        {/* Password */}
        <div className='mb-4'>
          <label htmlFor="password" className='font-medium mb-1'>Password</label>

          <div className='relative'>
            <input id='password' required onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} placeholder='Enter your Password' className='w-full rounded-md px-3 py-1.5 text-sm relative placeholder:text-xs   ' style={{ border: `1px solid ${borderColor}` }} />
            <button className='absolute right-3 top-1/4 cursor-pointer  text-gray-500' onClick={() => setShowPassword(prev => !prev)} >{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>

          </div>
        </div>

        {/* Role */}
        <div className='mb-4'>
          <label htmlFor="role" className="font-medium mb-1 block">Role</label>
          <div className="flex justify-evenly gap-2">
            {["user", "owner", "deliveryBoy"].map((roleX) => (
              <button
                key={roleX}
                type="button"
                onClick={() => setRole(roleX)}
                className="rounded-md px-4 py-2 font-semibold text-center transition-colors cursor-pointer"
                style={{
                  border: `1px solid ${hoverColor}`,
                  backgroundColor: role === roleX ? primaryColor : "#fff",
                  color: role === roleX ? "#fff" : "#333",
                }}
              >
                {roleX}
              </button>
            ))}
          </div>
        </div>
        {/* SignUp */}
        <div className="flex items-center justify-center mb-4">
          <button type="button"
            disabled={loading} onClick={handleSignUp} className="w-full py-2 px-4 rounded-md font-semibold text-white cursor-pointer bg-[#ff4d2d] hover:bg-[#e64323] transition-colors">
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign Up"}
          </button>
        </div>
        {error && <div className='text-red-500 text-sm mb-2 text-center' >*{error}</div>}

        {/* Google SignUp */}
        <div className='mb-2'>
          <button onClick={handleGoogleAuth} className='w-full flex justify-center gap-2 border cursor-pointer border-gray-300 rounded-md py-2 px-4 hover:bg-gray-200 transition-colors' disabled={loading} >
            <FcGoogle size={24} className='' />
            <span>Signup with Google </span>
          </button>
        </div>

        {/* Already have an account? SignIn */}
        <div className='' >
          <p className='text-sm text-center cursor-pointer ' onClick={() => navigate("/signIn")} >Already have an account? <span className='text-[#ff4d2d] font-semibold' >SignIn</span></p>
        </div>

      </div>
    </div >
  )
}

export default SignUp