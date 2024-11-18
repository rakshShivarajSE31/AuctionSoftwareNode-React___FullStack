

import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/ProjectList.css"; // Import the ProjectList.css file

const ProjectList = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [sortBy, page]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects", {
        params: { sort_by: sortBy, page },
        withCredentials: true,
      });
      setProjects(response.data);
      setHasNextPage(response.data.length === 2); // Check if there's a next page
    } catch (err) {
      console.error("Error fetching projects:", err);
      if (err.response?.status === 401) {
        navigate("/login"); // Redirect to login if unauthorized
      }
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset page to 1 when sorting changes
  };

  return (
    <div className="project-list-container">
      <div className="header">
        <h2>Project List</h2>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
      <label>
        Sort By:
        <select value={sortBy} onChange={handleSortChange}>
          <option value="recent">Recent Projects</option>
          <option value="category_name">Category Name (ASC)</option>
          <option value="username">Username (ASC)</option>
          <option value="project_title">Project Title (ASC)</option>
        </select>
      </label>
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Username</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.project_title || "Null"}</td>
              <td>{project.username || "Null"}</td>
              <td>{project.category_name || "Null"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prevPage) => prevPage - 1)}
        >
          Previous
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectList;

