import React, { useEffect, useState } from 'react'
import appWriteService from "../appwrite/config"
import { Container, PostForm } from "../components"
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function EditPost() {
    const [post, setPost] = useState(null)
    const navigate = useNavigate()
    const { slug } = useParams()

    useEffect(() => {
        if (slug) {
            appWriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                } else {
                    navigate("/")
                    toast.error("Edited Post Successfully!")
                }
            })
        }
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
