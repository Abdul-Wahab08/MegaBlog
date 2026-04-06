import React, { useEffect, useState } from 'react'
import appWriteService from "../supabase/config"
import { Container, PostForm } from "../components"
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function EditPost() {
    const [post, setPost] = useState(null)
    const navigate = useNavigate()
    const { slug } = useParams()

    useEffect(() => {
        if (!slug) return

        const fetchPost = async () => {
            try {
                const post = await appWriteService.getPost(slug)

                if (post) {
                    setPost(post)
                } else {
                    navigate("/")
                    toast.error("Edited Post Successfully!")
                }
            } catch (error) {
                console.error("fetch post's error: ", error)
                toast.error("Something went wrong")
                navigate("/")
            }
        }

        fetchPost()
    }, [slug, navigate])
    
    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost
