import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaUserTie, FaEdit, FaTrash } from 'react-icons/fa';

const CreatorList = () => {
  const [creators, setCreators] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        return;
      }
      const response = await axios.get('http://localhost:9900/user/get/creator', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setCreators(response.data);
    } catch (error) {
      console.error('Error fetching creators:', error);
    }
  };

  const handleUpdate = (creator) => {
    setEditingCreator(creator);
    setShowModal(true);
  };

  const handleDelete = async (userName) => {
    if (window.confirm('Are you sure you want to delete this creator?')) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete(`http://localhost:9900/user/delete/${userName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchCreators(); // Refresh the creator list
      } catch (error) {
        console.error('Error deleting creator:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCreator(null);
  };

  const handleModalSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://localhost:9900/user/update/user`, editingCreator, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      fetchCreators(); // Refresh the creator list
      handleModalClose();
    } catch (error) {
      console.error('Error updating creator:', error);
    }
  };

  const handleInputChange = (e) => {
    setEditingCreator({ ...editingCreator, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-success text-white">
          <FaUserTie className="me-2" />
          <span className="fs-4">All Creators</span>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Number</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.map(creator => (
                <tr key={creator.id}>
                  <td>{creator.id}</td>
                  <td>{creator.name}</td>
                  <td>{creator.userName}</td>
                  <td>{creator.email}</td>
                  <td>{creator.phoneNumber}</td>
                  <td>{creator.userRole}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleUpdate(creator)}>
                      <FaEdit /> Update
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(creator.userName)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Creator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingCreator && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={editingCreator.name} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="userName" value={editingCreator.userName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={editingCreator.email} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" name="phoneNumber" value={editingCreator.phoneNumber} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select name="userRole" value={editingCreator.userRole} onChange={handleInputChange}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="CREATER">CREATER</option>
        </Form.Select>
      </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreatorList;