
import React from 'react'

function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd"

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 ' style={{ backgroundColor: bgColor }} >

      <div className=' shadow-lg p-8 max-w-md rounded-xl bg-white border-[1px] ' style={{ borderColor: borderColor }} >

        <div className=' font-bold p-20 bg-red-100 text-red-600 ' style={{ color: primaryColor }}>
          Vingo
        </div>


        <div className='' style={{ color: borderColor }}>Create your account to get started with delicious food deliveries</div>
      </div>
    </div>
  )
}

export default SignUp