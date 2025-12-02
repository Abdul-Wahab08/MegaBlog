import React, { useState, useEffect } from 'react'
import appWriteServices from '../appwrite/config'

function LikeBtn({ postId, user }) {
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const loadLikes = async () => {
            const totalCount = await appWriteServices.likesCount(postId)
            setCount(totalCount);
            if (user && user.$id) {
                const hasLiked = await appWriteServices.userLikedPost(postId, user.$id)
                setLiked(hasLiked);
            } else {
                setLiked(false)
            }
        }
        loadLikes();
    }, [postId, user])


    const handleLike = async () => {
        if (liked) {
            await appWriteServices.unlikePost(postId, user.$id)
            setLiked(false);
            setCount(count - 1)
        } else {
            await appWriteServices.likePost(postId, user.$id)
            setLiked(true)
            setCount(count + 1);
        }
    }
    return (
        <>
            <button className={`px-4 py-2 ${liked ? "bg-[#ff4d6d] font-semibold" : "bg-gray-100"} text-lg text-black  transition cursor-pointer duration-200 rounded-lg`} onClick={handleLike}>
                <span className="ml-1">
                    {liked ? "You liked this" : "Like this post"}
                </span> {count}</button>
        </>
    )
}

export default LikeBtn
