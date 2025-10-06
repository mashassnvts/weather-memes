import React from 'react';

const MemeCard = ({ meme }) => {
  if (!meme) return null;

  return (
    <div className="meme-card">
      <div className="meme-header">
        <h3>🎭 Weather Meme</h3>
      </div>
      
      <div className="meme-content">
        <img 
          src={meme.image} 
          alt="Weather meme"
          className="meme-image"
        />
        <p className="meme-text">{meme.text}</p>
      </div>
    </div>
  );
};

export default MemeCard;