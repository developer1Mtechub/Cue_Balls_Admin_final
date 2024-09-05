import React, { useState } from 'react';
import { Edit, Save } from 'react-feather';

export const BallImage = ({ ball, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(ball.image_url);

  const handleEditClick = () => {
    setIsEditing(true);
  }

  const handleSaveClick = () => {
    setIsEditing(false);
    onSave(ball.name, imageUrl);
  }

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  }

  return (
    <div style={{position:'relative'}}>
      {isEditing ? (
        <input type="text" value={imageUrl} onChange={handleImageUrlChange} style={{marginTop:'50px',height:'50px',borderRadius:'10px',border:'1px solid lightGray'}} />
      ) : (
        <img src={imageUrl} alt={ball.name} style={{widtyh:'200px',height:'auto',marginBottom:'30px'}} />
      )}
      <button style={{position:'absolute',top:0,right:0,backgroundColor:'transparent',border:'none',color:'#03C4DE'}} onClick={isEditing ? handleSaveClick : handleEditClick}>
        {isEditing ? <Save/> : <Edit/>}
      </button>
    </div>
  );
}