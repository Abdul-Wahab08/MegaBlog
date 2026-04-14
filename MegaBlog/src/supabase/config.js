import supabase from "../utils/supabase";

export class Service {

    async createPost({ title, content, featuredImageUrl, status, slug, userId, username }) {
        try {
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

            if (error) {
                return { success: false, message: error.message }
            }

            return { success: true, data }
        } catch (error) {
            return { success: false, message: "Unexpected Error" }
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
                return { success: false, message: error.message }
            }

            return { success: true, data }
        } catch (error) {
            console.error("Unexpected error: ", error)
            return { success: false, message: "Unexpected Error" }
        }
    }

    async deletePost(slug) {
        try {
            const { error } = await supabase
                .from("posts")
                .delete()
                .eq("slug", slug)

            if (error) {
                return { success: false, message: error.message }
            }

            return { success: true }
        } catch (error) {
            return { success: false, message: "Unexpected Error" }
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
                return null
            }

            return data
        } catch (error) {
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
                return null
            }

            return data
        } catch (error) {
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
                return null
            }

            return fileUploadData

        } catch (error) {
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
                return false
            }

            return true
        } catch (error) {
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
                return
            }
        } catch (error) {
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
                return false
            }

            if (count > 0) {
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("postId", postId)
                    .eq("userId", userId)

                if (error) return false
                return true
            } else {
                return false
            }
        } catch (error) {
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
                return 0
            }

            return count
        } catch (error) {
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
                return false
            }

            if (data.length > 0) {
                return true
            } else {
                return false
            }

        } catch (error) {
            return false
        }
    }
}

const service = new Service()
export default service