import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container, LikeBtn } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.delete(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                toast.success("Post deleted!")
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex flex-col gap-5 justify-center items-center mb-4 relative rounded-xl p-2">
                    <div className="relative flex justify-center items-center w-full h-[50vh] sm:h-[70vh] mb-8">
                        <img
                            src={appwriteService.getFileDownload(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-xl">
                            <h1 className="text-xl sm:text-3xl font-bold">{post.title}</h1>
                            <div className="flex items-center gap-3 mb-6 text-white text-sm">
                                <span>By <strong>{post.userName || "Anonymous"}</strong></span>
                                <span>•</span>
                                <span>{Math.round((new Date() - new Date(post.$createdAt)) / (1000 * 60 * 60 * 24))} days ago</span>
                                {/* <span>{new Date(post.$createdAt).toLocaleDateString()}</span> */}
                            </div>
                            {isAuthor && (
                                <div className="flex justify-center items-center ">
                                    <Link to={`/edit-post/${post.$id}`}>
                                        <Button bgColor="bg-green-500 " className="mr-3 hover:bg-green-400">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button bgColor="bg-red-500" className="hover:bg-red-400" onClick={deletePost}>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200 p-6 m-2 rounded-2xl">
                    <div className="w-full mb-6">
                        <h1 className="text-3xl font-bold">{post.title}</h1>
                    </div>
                    <div className="browser-css prose prose-lg text-lg max-w-none text-gray-800">
                        {parse(post.content)}
                    </div>
                </div>
                <LikeBtn postId={post.$id} user={userData} />
            </Container>
        </div>
    ) : null;
}
