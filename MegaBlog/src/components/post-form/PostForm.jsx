import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import services from '../../supabase/config'
import { Button, Input, Loader, RTE } from '../index'
import Select from '../Select'
import { toast } from 'react-toastify'

function PostForm({ post }) {
    const { register, handleSubmit, setValue, watch, getValues, control } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active"
        }
    })
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    const submit = async (data) => {
        setLoading(true)
        try {
            if (post) {
                const file = data.image[0] ? await services.uploadFile(data.image[0]) : null
    
                if (file) {
                    services.deleteFile(post.featuredImage)
                }
    
                const dbPost = await services.updatePost(post.id, {
                    ...data,
                    featuredImageUrl: file ? file.path : post.featuredImage,
                })
    
                if (dbPost) {
                    navigate(`/post/${dbPost.id}`)
                    toast.success("Post is Updated")
                }
            } else {
    
                let filePath = null;
                if (data.image?.[0]) {
                    const file = await services.uploadFile(data.image[0])
                    filePath = file.path;
                }
    
                const dbPost = await services.createPost({
                    ...data,
                    featuredImageUrl: filePath,
                    userId: userData.user.id,
                    username: userData.user.user_metadata.username
                });
    
                if (dbPost) {
                    navigate(`/post/${dbPost.id}`)
                    toast.success("Post is Created")
                }
            }
        } catch (error) {
            console.error("Error occurs", error)
            toast.error(error)
        } finally{
        setLoading(false)
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value.trim().toLowerCase().replace(/\s/g, "-")
        }
        return "";
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title), { shouldValidate: true })
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue])


    return (
        <div>
            {loading ? <Loader /> : ""}
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className='w-full md:w-2/3 px-2'>
                    <Input label="Title" placeholder="Title" className="mb-4 font-bold" {...register("title", { required: true })} />
                    <Input label="Slug" placeholder="Slug" className="mb-4 font-bold" {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
                        }}
                    />
                    <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
                </div>
                <div className='w-full md:w-1/3 px-2'>
                    <Input label="Featured Image" type="file" className="my-2 mb-4" accept="image/png, image/jpg, image/jpeg, image/gif" {...register('image', { required: !post })} />
                    {/* {post && (<div className="w-full mb-4">
                        <img className='rounded-lg' src={services.getFileDownload(post.featuredImage)} alt={post.title} />
                    </div>)} */}
                    <Select options={["active", "inactive"]} label="Status" {...register("status", { required: true })} />
                    <Button type="submit" bgColor={post ? "bg-green-600" : undefined} className="w-full my-4" >
                        {post ? "Update" : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    )
}


export default PostForm