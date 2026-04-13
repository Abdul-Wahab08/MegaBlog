import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Loader, Logo } from '../components';
import authService from '../supabase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token_hash = params.get("token_hash")
        const type = params.get("type")

        if (token_hash && type === "recovery") {
            authService.verifyCodeForPasswordRecovery(token_hash).then((data) => {
                if (data) {
                    setIsPasswordRecovery(true)
                } else {
                    toast.error("Invalid or expired reset link of useeffect.");
                }
            }).catch((error) => {
                console.log("verifyOtp error:", error);
                toast.error("Invalid or expired reset link.");
            })
        }
    }, [])

    const handleResetPass = async (data) => {
        setLoading(true)

        if (data.password !== data.confirmPassword) {
            toast.error("Both New and confirm password field must be same")
            setLoading(false)
            return
        }

        if (!isPasswordRecovery) {
            toast.error("Invalid or expired reset link.")
            setLoading(false)
            navigate("/login")
            return
        }

        try {
            const response = await authService.resetPassword(data.password)

            if (!response.success) {
                toast.error(response.message || "Reset Password failed")
                navigate("/")
                return
            }

            await authService.logout()
            toast.success("Password reset successfull! Please log in.")
            navigate("/login")
        } catch (error) {
            toast.error(error.message || "Password reset failed.")
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
                    <h2 className="text-center text-2xl font-bold leading-tight">Enter New Password</h2>
                    <p className="mt-2 text-center text-base text-black/60">Looks like you are trying to reset the password for the account. Please enter your new password twice. So we can verify you typed it correctly.</p>
                    <form onSubmit={handleSubmit(handleResetPass)} className='mt-8'>
                        <div className='space-y-5'>
                            <Input label="New Password: " placeholder="Enter new Password" type="password" {...register("password", {
                                required: true,
                            })} />
                            <Input label="Confirm Password: " placeholder="Confirm new Password" type="password" {...register("confirmPassword", {
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
