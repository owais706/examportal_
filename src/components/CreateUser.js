import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    userRole: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
       console.log(formData);

      const response = await axios.post('http://localhost:9900/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
        
      // Handle success
      setSuccess('User created successfully!');
      
      // Reset form after successful submission
      setFormData({ name: '', userName: '', email: '', phoneNumber: '', password: '', userRole: '' });

    } catch (error) {
      // Handle error
      console.error('Error creating user:', error);
      setError('An error occurred while creating the user. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-warning text-dark">
          <FaUserPlus className="me-2" />
          <span className="fs-4">Create New User</span>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="userName" value={formData.userName} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number</Form.Label>
              <Form.Control type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="userRole" value={formData.userRole} onChange={handleChange} required>
                <option value="">Select a role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CREATER">CREATER</option>
                <option value="USER">USER</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Create User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateUser;
