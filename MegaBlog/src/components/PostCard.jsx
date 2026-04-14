import React, { useEffect, useState } from 'react'
import service from '../supabase/config'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function PostCard({ id, title, featuredImageUrl, createdAt, slug }) {
  const [imageUrl, setImageUrl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0CMibFlRVj46jf-9KmrMpptMMOuQgm5uSHg&s")

  useEffect(() => {
    const fetchPostimagePublicUrl = async () => {
      try {
        const publicUrl = await service.getFilePublicUrl(featuredImageUrl)

        if (!publicUrl) {
          toast.error("Post's image not found")
          setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0CMibFlRVj46jf-9KmrMpptMMOuQgm5uSHg&s")
        }

        setImageUrl(publicUrl)
      } catch (error) {
        console.error(error)
        setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0CMibFlRVj46jf-9KmrMpptMMOuQgm5uSHg&s")
      }
    }

    fetchPostimagePublicUrl()
  }, [])

  return (
    <Link to={`/post/${slug}`}>
      <div className='w-full h-full bg-gray-100 rounded-xl p-4'>
        <div className='w-full justify-center mb-2'>
          <img className='rounded-xl h-[40vh] w-full' src={imageUrl} alt={title} />
        </div>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <h2 className='text-lg font-bold hidden md:block'>{new Date(createdAt).toLocaleDateString()}</h2>
      </div>
    </Link>
  )
}

export default PostCard
