import React from 'react'
import { useDispatch } from 'react-redux'
import authService from "../../appwrite/auth"
import { logout } from "../../store/authSlice"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Logoutbtn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout())
      toast.success("Logout Sucessfully!")
      navigate("/")
    })
  }
  return (
    <button onClick={handleLogout} className='px-6 py-2 duration-200 font-bold cursor-pointer rounded-full hover: bg-gray-100'>Logout</button>
  )
}

export default Logoutbtn
