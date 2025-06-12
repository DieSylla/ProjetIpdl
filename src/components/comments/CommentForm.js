import React, { useState } from 'react';

const CommentForm = ({ onSubmit, isReply = false }) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    onSubmit(content);
    setContent('');
  };
  
  return (
    <form className={`comment-form ${isReply ? 'reply-form' : ''}`} onSubmit={handleSubmit}>
      <textarea
        placeholder={isReply ? "Écrire une réponse..." : "Ajouter un commentaire..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <button type="submit" className="submit-comment">
        {isReply ? "Répondre" : "Commenter"}
      </button>
    </form>
  );
};

export default CommentForm;
