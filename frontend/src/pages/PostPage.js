import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { format } from "date-fns";
import { UserContext } from '../UserContext';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import '../styles/postpage.css';

export default function PostPage() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [postInfo, setPostInfo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        fetch(`${backendUrl}/post/${id}`)
            .then(response => response.json())
            .then(data => {
                setPostInfo(data);
                
            });
        fetch(`${backendUrl}/comments/${id}`)
            .then(response => response.json())
            .then(setComments);
    }, [id, backendUrl]);

    const addComment = async () => {
        if (!newComment.trim()) return;
        const response = await fetch(`${backendUrl}/comments/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content: newComment })
        });
        if (response.ok) {
            const comment = await response.json();
            setComments([...comments, comment]);
            setNewComment("");
        }
    };

    

    if (!postInfo) return '';

    return (
        <div className="post-container">
            <div className="post-content">
                <h1 className="post-title">{postInfo.title}</h1>
                <div className="post-meta-edit">
                    <p className="post-meta">
                        {format(new Date(postInfo.createdAt), 'MMMM d, yyyy')} |  
                        <PersonIcon className="icon" /> {postInfo.author.username}
                    </p>
                    {userInfo.id === postInfo.author._id && (
                        <Link to={`/edit/${postInfo._id}`} className="edit-button">
                            <EditIcon className="icon" /> Edit Post
                        </Link>
                    )}
                </div>
                
                <img src={postInfo.cover} alt={postInfo.title} className="post-image" />
                <div className="post-body" dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
                
                <div className="comments-section">
                    <h2 className="comments-title">Comments</h2>
                    <div className="comment-input">
                        <input
                            type="text"
                            className="comment-field"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button className="comment-button" onClick={addComment}>
                            <SendRoundedIcon className="icon" /> 
                        </button>
                    </div>
                    <div className="comment-list">
                        {comments.map(comment => (
                            <div className="comment-item" key={comment._id}>
                                <strong><PersonIcon className="icon" /> {comment.author.username}</strong> {comment.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}