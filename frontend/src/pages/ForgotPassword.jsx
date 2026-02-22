
import React, { useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';


function ForgotPassword() {

    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passowrd, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSendOtp = async (email) => {

        try {
            await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
            setStep(2);

        } catch (error) {
            console.log(`Send Otp Error : ${error.response.data.message}`);
        }


    }

    const handleVerifyOtp = async (email, otp) => {

        try {

            await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
            setStep(3);

        } catch (error) {
            console.log(`Verify Otp Error : ${error.message}`);
        }

    }

    const handleResetPassword = async (email, password) => {

        if (password !== confirmPassword) {
            alert("Password and Confirm Password must be same");
            return;
        }

        try {

            await axios.post(`${serverUrl}/api/auth/reset-password`, { email, password }, { withCredentials: true });
            console
            navigate("/signin");

        } catch (error) {
            console.log(`Reset Password Error : ${error.message}`);
        }

    }






    return (
        <div className='w-full min-h-screen bg-[#fff9f6] p-4  flex items-center justify-center ' >
            <div className='w-full  max-w-md shadow-lg rounded-xl p-8  bg-white  ' >

                <div className=' flex justify-start items-center gap-x-5 m-2 cursor-pointer' >

                    <IoArrowBackOutline className=' text-[#ff4d2d] font-bold size-5 ' onClick={() => navigate("/signin")} />
                    <h1 className=' text-[#ff4d2d] font-bold ' >Forgot Password</h1>
                </div>


                {/* Step 1 */}
                {step == 1 && <div>


                    <div className='flex flex-col mb-4  '>

                        <label htmlFor="email" className=' font-medium mb-1'>Email</label>
                        <input id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter you Email' className=' text-sm rounded-sm border w-full border-[#ddd] px-3 py-1.5   placeholder:text-xs  ' type="text" />

                    </div>        <div className="flex items-center justify-center mb-4">
                        <button onClick={() => handleSendOtp(email)} className="w-full py-2 px-4 rounded-md font-semibold text-white cursor-pointer bg-[#ff4d2d] hover:bg-[#e64323] transition-colors">
                            Send Otp
                        </button>
                    </div>
                </div>

                }

                {/* Step 2 */}
                {
                    step == 2 && <div>

                        <div className='flex flex-col mb-4  '>

                            <label htmlFor="otp" className=' font-medium mb-1'>Otp</label>
                            <input id='otp' value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='Enter you Otp' className=' text-sm rounded-sm border w-full border-[#ddd] px-3 py-1.5   placeholder:text-xs  ' type="text" />

                        </div>        <div className="flex items-center justify-center mb-4">
                            <button onClick={() => handleVerifyOtp(email, otp)} className="w-full py-2 px-4 rounded-md font-semibold text-white cursor-pointer bg-[#ff4d2d] hover:bg-[#e64323] transition-colors">
                                Verify Otp
                            </button>
                        </div>


                    </div>
                }

                {/* Step 3 */}

                {
                    step == 3 && <div>

                        <div className='flex flex-col mb-4  '>
                            <label htmlFor="password" className=' font-medium mb-1'>Password</label>
                            <input id='password' value={passowrd} onChange={(e) => setPassword(e.target.value)} placeholder='Enter you password' className=' text-sm rounded-sm border w-full border-[#ddd] px-3 py-1.5   placeholder:text-xs  ' type="text" />
                        </div>
                        <div className='flex flex-col mb-4  '>
                            <label htmlFor="confirmPassword" className=' font-medium mb-1'>Confirm Password</label>
                            <input id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password' className=' text-sm rounded-sm border w-full border-[#ddd] px-3 py-1.5   placeholder:text-xs  ' type="text" />
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <button onClick={() => handleResetPassword(email, passowrd)} className="w-full py-2 px-4 rounded-md font-semibold text-white cursor-pointer bg-[#ff4d2d] hover:bg-[#e64323] transition-colors">
                                Reset Password
                            </button>
                        </div>


                    </div>
                }

            </div>


        </div>
    )
}

export default ForgotPassword