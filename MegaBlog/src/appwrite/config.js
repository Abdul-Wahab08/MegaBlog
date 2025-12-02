import conf from '../conf/conf'
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    buckets;

    constructor() {
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId)
        this.databases = new Databases(this.client)
        this.buckets = new Storage(this.client)
    }

    async createPost({ title, content, featuredImage, status, slug, userId, userName }) {
        try {
            return await this.databases.createDocument(conf.appWriteDatabaseId, conf.appWriteCollectionId, ID.unique(), {
                title,
                content,
                featuredImage,
                slug,
                status,
                userId,
                userName
            })
        } catch (error) {
            throw error;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            const payload = { title, content, status };
            if (featuredImage !== undefined && featuredImage !== null) {
                payload.featuredImage = featuredImage;
            }
            return await this.databases.updateDocument(conf.appWriteDatabaseId, conf.appWriteCollectionId, slug, payload)
        } catch (error) {
            throw error;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(conf.appWriteDatabaseId, conf.appWriteCollectionId, slug)
        } catch (error) {
            throw error;
            return false;
        }
    }

    async delete(slug) {
        try {
            await this.databases.deleteDocument(conf.appWriteDatabaseId, conf.appWriteCollectionId, slug)
            return true;
        } catch (error) {
            throw error;
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(conf.appWriteDatabaseId, conf.appWriteCollectionId, queries)
        } catch (error) {
            throw error;
            return false
        }
    }

    async uploadFile(file) {
        try {
            return await this.buckets.createFile(conf.appWriteBucketId, ID.unique(), file)
        } catch (error) {
            throw error;
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.buckets.deleteFile(conf.appWriteBucketId, fileId)
            return true;
        } catch (error) {
            throw error;
            return false;
        }
    }

    getFileDownload(fileId) {
        return this.buckets.getFileDownload(conf.appWriteBucketId, fileId)
    }

    async likePost(postId, userId) {
        try {
            return await this.databases.createDocument(conf.appWriteDatabaseId, conf.appWriteLikesId, ID.unique(), { postId, userId })
        } catch (error) {
            throw error;
        }
        return false;
    }

    async unlikePost(postId, userId) {
        try {
            const res = await this.databases.listDocuments(conf.appWriteDatabaseId, conf.appWriteLikesId,
                [
                    Query.equal("postId", postId),
                    Query.equal("userId", userId)
                ]
            )
            if (res.total > 0) {
                this.databases.deleteDocument(conf.appWriteDatabaseId, conf.appWriteLikesId, res.documents[0].$id);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    async likesCount(postId) {
        try {
            const res = await this.databases.listDocuments(conf.appWriteDatabaseId, conf.appWriteLikesId, [Query.equal("postId", postId)])
            return res.total;
        } catch (error) {
            return 0;
        }
    }

    async userLikedPost(postId, userId) {
        try {
            const res = await this.databases.listDocuments(conf.appWriteDatabaseId, conf.appWriteLikesId,
                [
                    Query.equal("postId", postId),
                    Query.equal("userId", userId)
                ]
            )
            return res.total > 0;
        } catch (error) {
            return false;
        }
    }
}

const service = new Service();

export default service