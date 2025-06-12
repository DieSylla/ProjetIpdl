import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import '../../style/components/comments.css';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Récupérer l'utilisateur actuel
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(currentUser);
    
    // Récupérer les commentaires pour cette vidéo
    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    const videoComments = allComments.filter(comment => 
      comment.videoId === videoId && comment.parentId === null
    );
    
    setComments(videoComments);
  }, [videoId]);
  
  const addComment = (content) => {
    if (!user) return;
    
    const newComment = {
      id: Date.now().toString(),
      videoId,
      userId: user.email,
      userName: `${user.prenom} ${user.nom}`,
      content,
      timestamp: Date.now(),
      likes: 0,
      parentId: null,
      replies: []
    };
    
    // Mettre à jour l'état local
    setComments(prevComments => [...prevComments, newComment]);
    
    // Sauvegarder dans localStorage
    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    localStorage.setItem('comments', JSON.stringify([...allComments, newComment]));
  };
  
  const addReply = (parentId, content) => {
    if (!user) return;
    
    const reply = {
      id: Date.now().toString(),
      videoId,
      userId: user.email,
      userName: `${user.prenom} ${user.nom}`,
      content,
      timestamp: Date.now(),
      likes: 0,
      parentId
    };
    
    // Mettre à jour l'état local
    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    const updatedComments = [...allComments, reply];
    
    // Mettre à jour le commentaire parent avec la nouvelle réponse
    const parentComment = allComments.find(comment => comment.id === parentId);
    if (parentComment) {
      parentComment.replies = [...(parentComment.replies || []), reply.id];
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    
    // Rafraîchir les commentaires
    const videoComments = updatedComments.filter(comment => 
      comment.videoId === videoId && comment.parentId === null
    );
    setComments(videoComments);
  };
  
  const likeComment = (commentId) => {
    if (!user) return;
    
    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    const updatedComments = allComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: (comment.likes || 0) + 1 };
      }
      return comment;
    });
    
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    
    // Rafraîchir les commentaires
    const videoComments = updatedComments.filter(comment => 
      comment.videoId === videoId && comment.parentId === null
    );
    setComments(videoComments);
  };
  
  return (
    <div className="comments-section">
      <h2>Commentaires ({comments.length})</h2>
      
      <CommentForm onSubmit={addComment} />
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">Soyez le premier à commenter cette vidéo !</p>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onReply={addReply}
              onLike={likeComment}
              allComments={JSON.parse(localStorage.getItem('comments')) || []}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
