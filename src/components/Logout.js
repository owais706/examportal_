import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContest'; 
import './Logout.css'; 

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(true); 

  const handleConfirm = () => {
    // Remove items from local storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isLoggedIn');

    // Perform logout
    logout();

    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1); // back to  the previous page
  };

  if (confirming) {
    
    return (
      <div className="logout-container">
        <div className="confirmation-dialog">
          <h2>Are you sure you want to log out?</h2>
          <button onClick={handleConfirm}>Yes, log out</button>
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return <div>Logging out...</div>;
};

export default Logout;
