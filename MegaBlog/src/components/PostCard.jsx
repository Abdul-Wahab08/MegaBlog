import React from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, $createdAt }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full h-full bg-gray-100 rounded-xl p-4'>
        <div className='w-full justify-center mb-2'>
          <img className='rounded-xl h-1/4 w-full' src={appwriteService.getFileDownload(featuredImage)} alt={title} />
        </div>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <h2 className='text-lg font-bold hidden md:block'>{new Date($createdAt).toLocaleDateString()}</h2>
      </div>
    </Link>
  )
}

export default PostCard
