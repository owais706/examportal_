import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserTie, FaClipboardList, FaUserPlus } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const cards = [
    { title: 'See all Users', icon: <FaUsers />, link: '/admin/users', color: '#3498db' },
    { title: 'See all Creators', icon: <FaUserTie />, link: '/admin/creators', color: '#e74c3c' },
    { title: 'See all Tests', icon: <FaClipboardList />, link: '/admin/tests', color: '#2ecc71' },
    { title: 'Create a New User', icon: <FaUserPlus />, link: '/admin/create-user', color: '#f39c12' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="dashboard-content">
        <div className="card-container">
          {cards.map((card, index) => (
            <Link to={card.link} key={index} className="dashboard-card" style={{ backgroundColor: card.color }}>
              <div className="card-icon">{card.icon}</div>
              <h2 className="card-title">{card.title}</h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;