import React from 'react'
import { Container, Logoutbtn, Logo } from "../index"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: "Home",
      slug: "/",
      status: true
    }, {
      name: "Login",
      slug: "/login",
      status: !authStatus
    },
    {
      name: "Signup",
      slug: "/signup",
      status: !authStatus
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      status: authStatus
    },
    {
      name: "Add Posts",
      slug: "/add-post",
      status: authStatus
    }
  ]
  return (
    <header className='bg-gray-500 py-3 shadow rounded-lg'>
      <Container>
        <nav className='flex justify-between items-center flex-col md:flex-row gap-2 sm:gap-4'>
          <div className='flex items-center'>
            <Link to='/'> <Logo width="70px" /> </Link>
          </div>
          <ul className='flex sm:flex-row flex-wrap gap-1 sm:gap-4 font-medium'> {navItems.map((item) => item.status ?
            (<li key={item.name}> <button onClick={() => navigate(item.slug)} className='px-3 sm:px-6 py-2 cursor-pointer duration-200 rounded-full hover:bg-gray-100'>{item.name}</button> </li>)
            : null)}
          </ul>
          {authStatus && (
            <li className='list-none my-4 sm:my-0'>
              <Logoutbtn />
            </li>
          )}
        </nav>
      </Container>
    </header>
  )
}

export default Header
