import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaUsers, FaEdit, FaTrash } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        return;
      }
      const response = await axios.get('http://localhost:9900/user/get/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const  handleUpdate = async (user) => {
    

    setEditingUser(user);
    setShowModal(true);

    // const token = localStorage.getItem('jwtToken');
    // if (!token) {
    //   console.error('No JWT token found');
    //   return;
    // }

    // const response = await axios.get('http://localhost:9900/user/update/user', user,{
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }
    // });

   


  };

  const handleDelete = async (userName) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('jwtToken');
        console.log(token);
        await axios.delete(`http://localhost:9900/user/delete/${userName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleModalSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      console.log(editingUser);
      await axios.put(`http://localhost:9900/user/update/user`, editingUser,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      fetchUsers(); // Refresh the user list
      handleModalClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <FaUsers className="me-2" />
          <span className="fs-4">All Users</span>
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
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.userRole}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleUpdate(user)}>
                      <FaEdit /> Update
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.userName)}>
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
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={editingUser.name} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="userName" value={editingUser.userName} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={editingUser.email} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" name="phoneNumber" value={editingUser.phoneNumber} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control as="select" name="userRole" value={editingUser.userRole} onChange={handleInputChange}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="CREATER">CREATOR</option>
                  <option value="USER">USER</option>
                </Form.Control>
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

export default UserList;