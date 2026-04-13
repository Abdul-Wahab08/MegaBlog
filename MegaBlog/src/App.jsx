import { useEffect, useState } from 'react'
import authService from './supabase/auth'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from "./store/authSlice"
import { Header, Footer, Loader } from "./components"
import { Outlet, useNavigate } from 'react-router-dom'
import supabase from './utils/supabase'

function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout)
        }
      })
      .finally(() => setLoading(false))
  }, [])


  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : <Loader />
}

export default App
