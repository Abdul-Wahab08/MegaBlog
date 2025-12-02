import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Loader, Logo } from '../components';
import authService from '../appwrite/auth';
import { toast } from 'react-toastify';

function ForgetPassword() {
    const { register, handleSubmit, reset } = useForm();
    const [loading, setLoading] = useState(false)

    const handleForgetPass = async (data) => {
        setLoading(true)
        try {
            await authService.recoverPassword(data.email)
            toast.success("Password recovery email sent!");
            reset();
        } catch (error) {
            toast.error(error.message || "Error sending recovery email.");
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='flex justify-center items-center flex-col my-8 w-full'>
                {loading ? <Loader /> : ""}
                <div className={`mx-auto w-full max-w-lg bg-gray-100 p-10 rounded-xl border border-black/10`}>
                    <div className='flex justify-center mb-2'>
                        <span className='inline-block w-full max-w-[100px]'>{<Logo width="100%" />}</span>
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight">Forget Password?</h2>
                    <p className="mt-2 text-center text-base text-black/60">No Problem! Enter your email and we will send you an email with instructions to reset your password.</p>
                    <form onSubmit={handleSubmit(handleForgetPass)} className='mt-8'>
                        <div className='space-y-5'>
                            <Input label="Email: " placeholder="Enter Your Email" type="email" {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Enter the Valid Email or Password!"
                                }
                            })} />
                            <Button type='submit' className='w-full'>Click</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword
