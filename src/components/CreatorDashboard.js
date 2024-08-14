import React from 'react';
import { Link } from 'react-router-dom';
import './CreatorDashboard.css'; // Import specific CSS for this component

const CreatorDashboard = () => {
  return (
    <div className="creator-dashboard">
      <div className="creator-header">
        <h1 className="header-title">Welcome, Creator!</h1>
      </div>
      <div className="creator-content">
        <div className="creator-overview">
          <div className="creator-card">
            <h3 className="card-title">Create a New Test</h3>
            <p className="card-description">Design and create new tests to assign to users.</p>
            <Link to="/creator/create-test" className="btn btn-primary">Create New Test</Link>
          </div>
          <div className="creator-card">
            <h3 className="card-title">View and Manage Tests</h3>
            <p className="card-description">View the list of tests you have created and manage them.</p>
            <Link to="/creator/test-list" className="btn btn-secondary">View Test List</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
