import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners";
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {

  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ NORMAL SIGN IN
  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      console.log("SignIn Successful");
      navigate("/"); // redirect after login

    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE SIGN IN
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let response = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: user.email },
        { withCredentials: true }
      );

      console.log("Google Auth Success");
      dispatch(setUserData(response.data));

      navigate("/");

    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ JSX MUST BE RETURNED FROM COMPONENT
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>
      <div className='shadow-lg p-8 max-w-md rounded-xl bg-white border w-full' style={{ border: `1px solid ${borderColor}` }}>

        <h1 className='text-3xl font-bold mb-2' style={{ color: primaryColor }}>
          Vingo
        </h1>

        <p className='text-gray-600 mb-8'>
          Sign in to continue
        </p>

        {/* Email */}
        <div className='mb-4'>
          <label className='font-medium mb-1'>Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder='Enter your Email'
            className='w-full rounded-md px-3 py-1.5 text-sm'
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label className='font-medium mb-1'>Password</label>
          <div className='relative'>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder='Enter your Password'
              className='w-full rounded-md px-3 py-1.5 text-sm'
              style={{ border: `1px solid ${borderColor}` }}
            />
            <button
              type="button"
              className='absolute right-3 top-2 text-gray-500'
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className='flex justify-end mb-4'>
          <span
            className='text-sm cursor-pointer'
            style={{ color: primaryColor }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        {/* Sign In */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-2 px-4 rounded-md font-semibold text-white transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign In"}
        </button>

        {/* Google Sign In */}
        <div className='mt-4'>
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className='w-full flex justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition-colors'
          >
            <FcGoogle size={20} />
            <span>Sign In with Google</span>
          </button>
        </div>

        {error && (
          <div className='text-red-500 text-sm mt-3 text-center'>
            * {error}
          </div>
        )}

        {/* Signup Redirect */}
        <div className='mt-4 text-center'>
          <p
            className='text-sm cursor-pointer'
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? <span style={{ color: primaryColor, fontWeight: "600" }}>Sign Up</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default SignIn;