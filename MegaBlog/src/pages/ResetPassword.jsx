import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Loader, Logo } from '../components';
import authService from '../appwrite/auth';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
    const { register, handleSubmit, reset } = useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const userId = searchParams.get("userId")
    const secret = searchParams.get("secret")

    const handleResetPass = async (data) => {
        setLoading(true)
        try {
            await authService.resetPassword(userId, secret, data.password, data.confirmPassword)
            toast.success("Password reset successful! Please log in.")
            reset();
            navigate("/login")
        } catch (error) {
            toast.error(error.message || "Password reset failed.")
        } finally {
            setLoading(true)
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
                    <h2 className="text-center text-2xl font-bold leading-tight">Enter New Password</h2>
                    <p className="mt-2 text-center text-base text-black/60">Looks like you are trying to reset the password for the account. Please enter your new password twice. So we can verify you typed it correctly.</p>
                    <form onSubmit={handleSubmit(handleResetPass)} className='mt-8'>
                        <div className='space-y-5'>
                            <Input label="New Password: " placeholder="Enter new Password" type="password" {...register("password", {
                                required: true,
                            })} />
                            <Input label="Confirm Password: " placeholder="Confirm new Password" type="password" {...register("conformPassword", {
                                required: true,
                            })} />
                            <Button type='submit' className='w-full'>Reset Password</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
