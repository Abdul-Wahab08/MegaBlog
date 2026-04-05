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
                return
            }

            console.log("Post Creation Data: ", data)

            return data
        } catch (error) {
            console.error("Unexpected error: ", error)
        }
    }

    async uploadFile(file) {
        try {
            const filePath = `${file.name}-${Date.now()}`
            const { data: fileUploadData, error } = await supabase.storage.from("featuredImages").upload(filePath, file)

            if (error) {
                console.log("Error occurs while uploading file")
                return
            }

            console.log("File Uploading data: ", fileUploadData)

            const { data } = supabase.storage.from("featuredImage").getPublicUrl(filePath)
            console.log("FeaturedImage public url fetched data:  ", data)

            return data.publicUrl
        } catch (error) {
            console.error("Unexpected error: ", error)
        }
    }
}

const service = new Service()
export default service