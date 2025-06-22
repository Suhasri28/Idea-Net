import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import IdeaCard from "./IdeaCard";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [reqs, setReqs] = useState("");
  const [file, setFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate(); // ✅ Now placed correctly inside component

  const user = new URLSearchParams(location.search).get("name");

  const fetchIdeas = async () => {
    const res = await axios.get("http://localhost:5000/pitches?search=" + search);
    setIdeas(res.data);
  };

  useEffect(() => {
    fetchIdeas();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("requirements", reqs);
    formData.append("file", file);
    formData.append("postedBy", user);

    await axios.post("http://localhost:5000/pitch", formData);
    fetchIdeas();
    setTitle("");
    setDesc("");
    setReqs("");
    setFile(null);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user}</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="pitch-form">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
        <textarea placeholder="Requirements" value={reqs} onChange={(e) => setReqs(e.target.value)} required />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Submit Idea</button>
      </form>

      <input
        placeholder="Search pitches"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <h3>All Pitches</h3>
      {ideas.map((idea, idx) => (
        <IdeaCard idea={idea} key={idx} />
      ))}
    </div>
  );
};

export default Dashboard;
