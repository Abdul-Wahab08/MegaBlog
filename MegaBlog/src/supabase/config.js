import supabase from "../utils/supabase";

export class Service {

    async createPost({ title, content, featuredImageUrl, status, slug, userId, username }) {
        try {
            console.log({ title, content, featuredImageUrl, status, slug, userId, username })
            const { data, error } = await supabase.from("posts").insert({
                title,
                content,
                featuredImageUrl,
                status,
                slug,
                userId,
                username
            })
                .select()
                .single()

                console.log(data)
            if (error) {
                console.error("Error occurs while publishing post: ", error)
                return null
            }

            console.log("Post Creation Data: ", data)

            return data
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async updatePost(slug, { title, content, featuredImageUrl, status }) {
        try {
            const { data, error } = await supabase
                .from("posts")
                .update({
                    title,
                    content,
                    featuredImageUrl,
                    status
                })
                .eq("slug", slug)
                .select()
                .single()

            if (error) {
                console.error("Error occurs while publishing post: ", error)
                return null
            }

            console.log("Updated Post's Data: ", data)
            return data
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async deletePost(slug) {
        try {
            const { error } = await supabase
                .from("posts")
                .delete()
                .eq("slug", slug)

            if (error) {
                console.error("Error occurs while deleting post: ", error)
                return false
            }

            return true
        } catch (error) {
            console.error("Unexpected error: ", error)
            return false
        }
    }

    async getPost(slug) {
        try {
            const { data, error } = await supabase
                .from("posts")
                .select()
                .eq("slug", slug)
                .single()

            if (error) {
                console.error("Error occurs while fetching post: ", error)
                return null
            }

            return data
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async getPosts() {
        try {
            const { data, error } = await supabase
                .from("posts")
                .select()
                .eq("status", "active")

            if (error) {
                console.error("Error occurs while fetching posts: ", error)
                return null
            }

            console.log("fetching all posts's Data: ", data)
            return data
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async uploadFile(file) {
        try {
            const filePath = `${file.name}-${Date.now()}`
            const { data: fileUploadData, error } = await supabase
                .storage
                .from("featuredImages")
                .upload(filePath, file)

            if (error) {
                console.error("Error occurs while uploading file", error)
                return null
            }

            console.log("File Uploading data: ", fileUploadData)
            return fileUploadData

        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async deleteFile(filePath) {
        try {
            const { error } = await supabase
                .storage
                .from("featuredImages")
                .remove([filePath])

            if (error) {
                console.error("Error occurs while deleting file", error)
                return false
            }

            return true
        } catch (error) {
            console.error("Unexpected error: ", error)
            return false
        }
    }

    async getFilePublicUrl(filePath) {
        try {
            const { data } = supabase
                .storage
                .from("featuredImages")
                .getPublicUrl(filePath)
                
            return data.publicUrl
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async likePost({ postId, userId }) {
        try {
            const { error } = await supabase.from("likes").insert({
                postId,
                userId
            })

            if (error) {
                console.error("Error occurs while liking post", error)
                return
            }
        } catch (error) {
            console.error("Unexpected error: ", error)
            return
        }
    }

    async unlikePost({ postId, userId }) {
        try {
            const { count, error: isUserLikesPostError } = await supabase
                .from("likes")
                .select("*", { count: 'exact', head: true })
                .eq("postId", postId)
                .eq("userId", userId)

            if (isUserLikesPostError) {
                console.error("Error occurs while fetching total likes ", isUserLikesPostError)
                return false
            }

            if (count > 0) {
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("postId", postId)
                    .eq("userId", userId)

                if (error) {
                    console.error("Error occurs while unliking post ", error)
                    return false
                }

                return true
            } else {
                return false
            }
        } catch (error) {
            console.error("Unexpected error: ", error)
            return false
        }
    }

    async likesCount(postId) {
        try {
            const { count, error } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("postId", postId)

            if (error) {
                console.error("Error occurs while fetching total likes ", error)
                return 0
            }

            return count
        } catch (error) {
            console.error("Unexpected error: ", error)
            return 0
        }
    }

    async userLikedPost({ postId, userId }) {
        try {
            const { data, error } = await supabase
                .from("likes")
                .select()
                .eq("postId", postId)
                .eq("userId", userId)

            if (error) {
                console.error("Error occurs while finding user likes his post ", error)
                return false
            }

            if (data.length > 0) {
                return true
            } else {
                return false
            }

        } catch (error) {
            console.error("Unexpected error: ", error)
            return false
        }
    }
}

const service = new Service()
export default service