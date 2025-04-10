import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-50">
            <div className="mx-auto max-w-screen w-[1550px] px-4 py-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center text-teal-600 sm:justify-start">
                        <img src="/logo.png" alt="logo" className='h-[50px] w-[50px] object-contain' />
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
                        Copyright &copy; 2022. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
