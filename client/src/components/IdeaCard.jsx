import React, { useState } from "react";
import axios from "axios";

const IdeaCard = ({ idea, currentUser }) => {
  const [showApply, setShowApply] = useState(false);
  const [name, setName] = useState(currentUser);
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [resume, setResume] = useState(null);

  const handleApply = async () => {
    if (!email || !resume) {
      alert("Please provide email and resume.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("github", github);
    formData.append("resume", resume);

    try {
      const res = await axios.post(`http://localhost:5000/apply/${idea._id}`, formData);
      alert(res.data.message);
      setShowApply(false);
    } catch (err) {
      alert("Something went wrong!");
    }
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

      {idea.postedBy !== currentUser && (
        <>
          {!showApply ? (
            <button onClick={() => setShowApply(true)} style={{ marginTop: "10px" }}>Apply</button>
          ) : (
            <div style={{ marginTop: "10px" }}>
              <input placeholder="Your Email" type="email" onChange={(e) => setEmail(e.target.value)} />
              <input placeholder="GitHub Link (optional)" onChange={(e) => setGithub(e.target.value)} />
              <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
              <button onClick={handleApply}>Submit Application</button>
              <button onClick={() => setShowApply(false)}>Cancel</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IdeaCard;
