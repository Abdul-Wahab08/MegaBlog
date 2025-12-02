import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import appWriteServices from '../../appwrite/config'
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
        if (post) {
            const file = data.image[0] ? await appWriteServices.uploadFile(data.image[0]) : null


            if (file) {
                appWriteServices.deleteFile(post.featuredImage)
            }

            const dbPost = await appWriteServices.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : post.featuredImage,
            })

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
                toast.success("Post is Updated")
            }
        } else {

            let fileId = null;
            if (data.image?.[0]) {
                const file = await appWriteServices.uploadFile(data.image[0])
                fileId = file.$id;
            }

            const dbPost = await appWriteServices.createPost({
                ...data,
                featuredImage: fileId,
                userId: userData.$id,
                userName: userData.name
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
                toast.success("Post is Created")
            }
        }
        setLoading(false)
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
                    {post && (<div className="w-full mb-4">
                        <img className='rounded-lg' src={appWriteServices.getFileDownload(post.featuredImage)} alt={post.title} />
                    </div>)}
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