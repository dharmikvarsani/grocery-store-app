"use client"
import { Button } from '@/components/ui/button'
import { LogIn } from '@/utils/globleApi'
import { LoaderIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loader, setLoader] = useState()
    const router = useRouter()

    useEffect(() => {
        const jwt = sessionStorage.getItem("token")
        if (jwt) {
            router.push('/')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoader(true)
            const res = await LogIn(email, password)
            sessionStorage.setItem("user", JSON.stringify(res.data.user))
            sessionStorage.setItem("token", res.data.jwt)
            toast.success("LogIn Successfull")
            router.push('/')
            setLoader(false)
        } catch (error) {
            toast(error?.response?.data?.error?.message)
            setLoader(false)
        }
    }

    return (
        <div>
            <div className='flex flex-col items-center justify-center lg:pt-40 pt-10'>
                <form className="modern-form" onSubmit={handleSubmit}>
                    <div className="form-title">Log In</div>
                    <div className="form-body">
                        <div className="input-group">
                            <div className="input-wrapper">
                                <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                    <path
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                                    ></path>
                                </svg>
                                <input
                                    required=""
                                    placeholder="Email"
                                    className="form-input"
                                    type="email"
                                    name='email'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                    <path
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                                    ></path>
                                </svg>
                                <input
                                    required=""
                                    placeholder="Password"
                                    className="form-input"
                                    type="password"
                                    name='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button className="password-toggle" type="button">
                                    <svg fill="none" viewBox="0 0 24 24" className="eye-icon">
                                        <path
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                        ></path>
                                        <circle
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            r="3"
                                            cy="12"
                                            cx="12"
                                        ></circle>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button className="submit-button" type="submit" disabled={!(email && password)}>
                        <span className="button-text">{loader ? <LoaderIcon className='animate-spin' /> : 'Log In'}</span>
                        <div className="button-glow"></div>
                    </Button>

                    <div className="form-footer">
                        <Link className="login-link" href={'/signup'}>
                            Don't have an account? <span>Sign Up</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
