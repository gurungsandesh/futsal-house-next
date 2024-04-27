import React from 'react'

const UserDashboard = () => {
    return (
        <div className='h-screen bg-red-500 relative'>
            This is user page

            <div className=' bg-[#08985A] absolute bottom-0 left-0 right-0 h-[10vh] '>

                <div className='h-[10vh] w-[10vh] bg-green-300 absolute bottom-10 left-[50%] -translate-x-1/2 overflow-hidden flex flex-col justify-between rounded-[50%]'>
                    <div className='cursor-pointer'>
                        test
                    </div>
                    <div className='bg-slate-200 h-2 w-screen'>
                    </div>
                    <div className='cursor-pointer' >
                        check
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard