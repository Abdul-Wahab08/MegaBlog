import { useState, useEffect } from 'react'
import services from '../supabase/config'
import { toast } from 'react-toastify'

function LikeBtn({ postId, postUserId, user }) {
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(0)

    const handleLike = async () => {
        try {
            if (liked) {
                const isvalidLikes = await services.unlikePost({
                    postId,
                    userId: user.user.id
            })
                if (isvalidLikes) {
                    setLiked(false);
                    setCount(count - 1)
                }
            } else {
                await services.likePost({
                    postId,
                    userId: user.user.id
                })
                setLiked(true)
                setCount(count + 1);
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const loadLikes = async () => {
            try {
                const totalCount = await services.likesCount(postId)
                setCount(totalCount);
                if (user && user.user.id) {
                    const hasLiked = await services.userLikedPost({
                        postId,
                        userId: user.user.id
                })
                    setLiked(hasLiked);
                } else {
                    setLiked(false)
                }
            } catch (error) {
                console.error(error)
            }
        }
        loadLikes();
    }, [])

    return (
        <>
            <button className={`px-4 py-2 ${liked ? "bg-[#ff4d6d] font-semibold" : "bg-gray-100"} text-lg text-black  transition cursor-pointer duration-200 rounded-lg`} onClick={handleLike}>
                <span className="ml-1">
                    {liked ? "Liked" : "Likes"}
                    
                </span> {count}</button>
        </>
    )
}

export default LikeBtn
