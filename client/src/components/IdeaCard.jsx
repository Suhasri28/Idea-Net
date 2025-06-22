import React, { useState } from "react";
import axios from "axios";

const IdeaCard = ({ idea, user, refresh }) => {
  const [resume, setResume] = useState(null);

  const hasApplied = idea.applicants?.some((a) => a.name === user);
  const isOwner = idea.postedBy === user;

  const handleApply = async () => {
    const formData = new FormData();
    formData.append("ideaId", idea._id);
    formData.append("name", user);
    formData.append("resume", resume);
    await axios.post("http://localhost:5000/apply", formData);
    alert("Applied successfully");
    refresh();
  };

  const handleStatusChange = async (applicantName, status) => {
    await axios.post("http://localhost:5000/update-status", {
      ideaId: idea._id,
      applicantName,
      status,
    });
    refresh();
  };

  return (
    <div className="idea-card">
      <h4>{idea.title}</h4>
      <p>{idea.description}</p>
      <p><strong>Requirements:</strong> {idea.requirements}</p>
      <p><em>Posted by:</em> {idea.postedBy}</p>
      {idea.fileUrl && (
        <a href={`http://localhost:5000${idea.fileUrl}`} target="_blank" rel="noopener noreferrer">Download File</a>
      )}

      {!isOwner && !hasApplied && (
        <>
          <input type="file" onChange={(e) => setResume(e.target.files[0])} />
          <button onClick={handleApply}>Apply</button>
        </>
      )}

      {isOwner && idea.applicants?.length > 0 && (
        <>
          <h5>Applicants:</h5>
          {idea.applicants.map((a, idx) => (
            <div key={idx}>
              <p><strong>{a.name}</strong> - <em>{a.status}</em></p>
              {a.resumeUrl && (
                <a href={`http://localhost:5000${a.resumeUrl}`} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              )}
              {a.status === "Pending" && (
                <>
                  <button onClick={() => handleStatusChange(a.name, "Accepted")}>Accept</button>
                  <button onClick={() => handleStatusChange(a.name, "Rejected")}>Reject</button>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default IdeaCard;
