import React, { useState } from 'react'
import { login } from '../store/authSlice'
import authService from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import { Input, Button, Logo, Loader } from './index'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const create = async (data) => {
        setError("")
        setLoading(true)
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                await authService.getCurrentUser()
                if (userData) dispatch(login(userData))
                toast.success("Your account created Successfully!")
                navigate("/")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex justify-center items-center flex-col my-8 w-full'>
            {loading ? <Loader /> : ""}
            <div className={`mx-auto w-full max-w-lg bg-gray-100 p-10 rounded-xl border border-black/10`}>
                <div className='flex justify-center mb-2'>
                    <span className='inline-block w-full text-center max-w-[100px]'>{<Logo width="100%" />}</span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create your account</h2>
                <p className="mt-2 mb-6 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className='text-red-600 text-center mt-8'>{error}</p>}
                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input label="Full Name:" className="w-[30vw]" placeholder="Enter your Name" type="text" {...register("name", {
                            required: true,
                        })} />
                        <Input label="Email:" placeholder="Enter your Email" type="email" {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Enter the Valid Email or Password!"
                            }
                        })} />
                        <Input label="Password:" placeholder="Enter your Password" type="password" {...register("password", {
                            required: true,
                        })} />
                        <Button type='submit' className='w-full'>Create Account</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
