import { useEffect, useState } from 'react'
import service from "../supabase/config"
import { Container, PostCard } from "../components"

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => { }, [])
    service.getPosts([]).then((posts) => {
        if (posts) {
            setPosts(posts)
        }
    })
    return (
        <div className='w-full flex justify-center items-center py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length !== 0 ? posts.map((post) => (
                        <div key={post.id} className='p-2 w-full sm:w-1/4'>
                            <PostCard {...post} />
                        </div>
                    )) : ""}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts
