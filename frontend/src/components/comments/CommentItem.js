import React, { useState } from 'react';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onReply, onLike, allComments }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // Formater la date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Récupérer les réponses à ce commentaire
  const getReplies = () => {
    if (!comment.replies || comment.replies.length === 0) return [];
    
    return comment.replies.map(replyId => 
      allComments.find(c => c.id === replyId)
    ).filter(Boolean);
  };
  
  const replies = getReplies();
  
  const handleReply = (content) => {
    onReply(comment.id, content);
    setShowReplyForm(false);
  };
  
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-author">{comment.userName}</span>
        <span className="comment-date">{formatDate(comment.timestamp)}</span>
      </div>
      <p className="comment-content">{comment.content}</p>
      <div className="comment-actions">
        <button className="like-button" onClick={() => onLike(comment.id)}>
          <i className="fa-regular fa-thumbs-up"></i> {comment.likes || 0}
        </button>
        <button className="reply-button" onClick={() => setShowReplyForm(!showReplyForm)}>
          <i className="fa-solid fa-reply"></i> Répondre
        </button>
      </div>
      
      {showReplyForm && (
        <div className="reply-form-container">
          <CommentForm onSubmit={handleReply} isReply />
        </div>
      )}
      
      {replies.length > 0 && (
        <div className="replies">
          {replies.map(reply => (
            <div key={reply.id} className="reply">
              <div className="comment-header">
                <span className="comment-author">{reply.userName}</span>
                <span className="comment-date">{formatDate(reply.timestamp)}</span>
              </div>
              <p className="comment-content">{reply.content}</p>
              <div className="comment-actions">
                <button className="like-button" onClick={() => onLike(reply.id)}>
                  <i className="fa-regular fa-thumbs-up"></i> {reply.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
