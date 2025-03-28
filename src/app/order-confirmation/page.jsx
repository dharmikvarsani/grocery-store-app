'use client'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const OrderConfirmation = () => {
    const router = useRouter()
    return (
        <div className='flex justify-center my-20'>
            <div className='flex shadow-md border flex-col justify-center md:p-20 p-13 rounded-md items-center gap-3 md:px-32 px-5'>
                <CheckCircle2 className='h-24 w-24 text-[#3bb77e]' />
                <h2 className='font-medium text-3xl text-[#3bb77e]'>Order Successfull</h2>
                <h2>Thank you so much for your order</h2>
                <Button className='mt-8 bg-[#3bb77e] hover:bg-[#548956]' onClick={() => router.push('/')} >Back To Home Page</Button>
            </div>
        </div>
    )
}

export default OrderConfirmation
