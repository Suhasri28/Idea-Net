import React from "react";

const IdeaCard = ({ idea }) => {
  return (
    <div className="idea-card">
      <h4>{idea.title}</h4>
      <p>{idea.description}</p>
      <p><strong>Requirements:</strong> {idea.requirements}</p>
      <p><em>Posted by:</em> {idea.postedBy}</p>
      {idea.fileUrl && (
        <a href={`http://localhost:5000${idea.fileUrl}`} target="_blank" rel="noopener noreferrer">Download File</a>
      )}
    </div>
  );
};

export default IdeaCard;
