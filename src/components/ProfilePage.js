import React, { useState, useEffect } from 'react';
import { Button, Form, Image, Container, Row, Col, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const data = JSON.parse(localStorage.getItem('userInfo'));
  const [user, setUser] = useState(data);
  const [editMode, setEditMode] = useState({});
  const [editedUser, setEditedUser] = useState({...user});
  const [notification, setNotification] = useState(null);

  const toggleEditMode = (field) => {
    setEditMode(prev => ({...prev, [field]: !prev[field]}));
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        showNotification('Authentication error. Please log in again.', 'danger');
        return;
      }

      // Basic validation
      if (!editedUser.name || !editedUser.userName || !editedUser.email) {
        showNotification('Name, username, and email are required fields', 'warning');
        return;
      }

      await axios.put(`http://localhost:9900/user/update/user`, editedUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUser(editedUser);
      localStorage.setItem('userInfo', JSON.stringify(editedUser));
      setEditMode({});
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Failed to update profile. Please try again.', 'danger');
    }
  };

  return (
    <Container className="profile-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {notification && (
            <Alert variant={notification.type} onClose={() => setNotification(null)} dismissible>
              {notification.message}
            </Alert>
          )}
          <div className="profile-card">
            <Image src="https://drkaranhospital.com/wp-content/uploads/2021/02/user.png" roundedCircle className="profile-img" />
            <Form onSubmit={handleSubmit}>
              <h2 className="profile-name">
                {editMode.name ? (
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <>{user.name}</>
                )}
                <FaPencilAlt className="edit-icon" onClick={() => toggleEditMode('name')} />
              </h2>
              <div className="profile-info">
                <p>
                  <FaUser className="info-icon" />
                  <strong>Username:</strong> 
                  {editMode.userName ? (
                    <Form.Control
                      type="text"
                      name="userName"
                      value={editedUser.userName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <>{user.userName}</>
                  )}
                  <FaPencilAlt className="edit-icon" onClick={() => toggleEditMode('userName')} />
                </p>
                <p>
                  <FaEnvelope className="info-icon" />
                  <strong>Email:</strong> 
                  {editMode.email ? (
                    <Form.Control
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <>{user.email}</>
                  )}
                  <FaPencilAlt className="edit-icon" onClick={() => toggleEditMode('email')} />
                </p>
                <p>
                  <FaPhone className="info-icon" />
                  <strong>Phone Number:</strong> 
                  {editMode.phoneNumber ? (
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={editedUser.phoneNumber}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <>{user.phoneNumber}</>
                  )}
                  <FaPencilAlt className="edit-icon" onClick={() => toggleEditMode('phoneNumber')} />
                </p>
                <p>
                  <FaLock className="info-icon" />
                  <strong>Password:</strong> ••••••
                </p>
              </div>
              <Button type="submit" variant="primary" className="mt-3">Submit Changes</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;