import React, { useState } from 'react'
import { login as storeLogin } from "../store/authSlice"
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button, Logo, Loader } from "./index"
import authService from "../appwrite/auth"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const { register, handleSubmit } = useForm()
    const[loading, setLoading] = useState(false)

    const login = async (data) => {
        setError("")
        setLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(storeLogin(userData));
                toast.success("Login SuccessFull")
                navigate("/")
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center flex-col my-8 w-full'>
            {loading ? <Loader /> : ""}
            <div className={`mx-auto w-full max-w-lg bg-gray-100 p-10 rounded-xl border border-black/10`}>
                <div className='flex justify-center mb-2'>
                    <span className='inline-block w-full max-w-[100px]'>{<Logo width="100%" />}</span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-600 p-2 mt-8 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input label="Email:" placeholder="Enter your Email" type="email" {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email Should must be a Valid Address!",
                            }
                        })} />
                        <Input label="Password:" placeholder="Enter your Password" type="password" {...register("password", {
                            required: true,
                        })} />
                        <Button type='submit' className='w-full'>Sign In</Button>
                         <Link to="/forget-password" className="font-medium text-primary transition-all duration-200 hover:underline">Forget Password ?</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
