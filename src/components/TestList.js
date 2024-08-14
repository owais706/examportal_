import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaClipboardList, FaEdit, FaTrash } from 'react-icons/fa';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        return;
      }
      const response = await axios.get('http://localhost:9900/test/get/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

  const handleUpdate = (test) => {
    setEditingTest(test);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        const token = localStorage.getItem('jwtToken');
        await axios.delete(`http://localhost:9900/test/delete/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchTests(); // Refresh the test list
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTest(null);
  };

  const handleModalSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put('http://localhost:9900/test/update', editingTest, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      fetchTests(); // Refresh the test list
      handleModalClose();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const handleInputChange = (e) => {
    setEditingTest({ ...editingTest, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-info text-white">
          <FaClipboardList className="me-2" />
          <span className="fs-4">All Tests</span>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty Level</th>
                <th>Duration</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id}>
                  <td>{test.id}</td>
                  <td>{test.title}</td>
                  <td>{test.category}</td>
                  <td>{test.difficultyLevel}</td>
                  <td>{test.duration}</td>
                  <td>{test.startTime}</td>
                  <td>{test.endTime}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleUpdate(test)}>
                      <FaEdit /> Update
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(test.id)}>
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
          <Modal.Title>Edit Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTest && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={editingTest.title} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control 
                  as="select" 
                  name="category" 
                  value={editingTest.category} 
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="APTITUDE">Aptitude</option>
                  <option value="REASONING">Reasoning</option>
                  <option value="PROGRAMMING">Programming</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Difficulty Level</Form.Label>
                <Form.Control 
                  as="select" 
                  name="difficultyLevel" 
                  value={editingTest.difficultyLevel} 
                  onChange={handleInputChange}
                >
                  <option value="">Select Difficulty Level</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control type="text" name="duration" value={editingTest.duration} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control type="datetime-local" name="startTime" value={editingTest.startTime} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control type="datetime-local" name="endTime" value={editingTest.endTime} onChange={handleInputChange} />
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

export default TestList;
