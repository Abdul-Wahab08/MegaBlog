import React, { useEffect, useState } from 'react'
import service from "../supabase/config"
import { Container, PostCard } from '../components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const status = useSelector((state) => state.auth.status)
    useEffect(() => {
        if(status){
            service.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts)
                }
            })
        }
    }, [])


    if (posts.length === 0 && !status) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                <Link to="/login">
                                    Login to read posts
                                </Link>
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    } else if (posts.length === 0 && status === true) {
    return (
        <div className="w-full py-8 mt-4 text-center">
        <Container>
            <div className="flex flex-wrap">
                <div className="p-2 w-full">
                    <Link to="/add-post">
                    <h1 className="text-2xl font-bold hover:text-gray-500">
                        No post till now. Upload First!
                    </h1>
                    </Link>
                </div>
            </div>
         </Container>
         </div>
        )
    } else {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className='flex flex-wrap'>
                        {posts.map((post) => (
                            <div key={post.id} className='p-2 w-full sm:w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }
}

export default Home
