import { useEffect, useState } from 'react'
import service from "../supabase/config"
import { Container, PostCard } from "../components"
import { Link } from 'react-router-dom'

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        service.getPosts().then((posts) => {
        if (posts) {
            setPosts(posts)
        }
     })
    
    }, [])
    return (
        <div className='w-full flex justify-center items-center py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length !== 0 ? posts.map((post) => (
                        <div key={post.id} className='p-2 w-full sm:w-1/4'>
                            <PostCard {...post} />
                        </div>
                    )) : <div className="p-2 w-full">
                    <Link to="/add-post">
                    <h1 className="text-2xl font-bold hover:text-gray-500">
                        No post till now. Upload First!
                    </h1>
                    </Link>
                </div>}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts
