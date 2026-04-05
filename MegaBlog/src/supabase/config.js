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
            const {data, error} = await supabase
            .from("posts")
            .update({
                title,
                content,
                featuredImageUrl,
                status
            })
            .eq("slug", slug)

             if (error) {
                console.error("Error occurs while publishing post: ", error)
                return null
            }

            console.log("Updated Post's Data: ", data)
        } catch (error) {
            console.error("Unexpected error: ", error)
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

            if (error) {
                console.error("Error occurs while publishing post: ", error)
                return null
            }

            console.log("Fetched post Data: ", data)
            return data
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async getPosts(){
        try {
          const {data, error} = await supabase
           .from("posts")
           .select()
           .eq("status", "active")

           if(error){
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
                console.error("Error occurs while uploading file")
                return
            }

            console.log("File Uploading data: ", fileUploadData)

            const { data } = supabase
            .storage
            .from("featuredImage")
            .getPublicUrl(filePath)
            console.log("FeaturedImage public url fetched data:  ", data)

            return data.publicUrl
        } catch (error) {
            console.error("Unexpected error: ", error)
            return null
        }
    }

    async deleteFile(filePath){
        try {
          const { error} = await supabase
          .storage
          .from("featuredImage")
          .remove([filePath]) 

          if(error){
            console.error("Error occurs while uploading file")
            return false
          }
          return true
        } catch (error) {
            console.error("Unexpected error: ", error)
            return false
        }
    }
}

const service = new Service()
export default service