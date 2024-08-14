import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import emailjs from 'emailjs-com';
import config from '../config';
import { FaFilter, FaCopy, FaUserPlus } from 'react-icons/fa';
import './CreatorPage.css';

const CreatorPage = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [username, setUsername] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [averageDifficulty, setAverageDifficulty] = useState(0);
  const [mostCommonDifficulty, setMostCommonDifficulty] = useState('');
  const navigate = useNavigate();

  const calculateTestStatistics = (tests) => {
    if (tests.length === 0) return;

    
    const difficultyValues = { 'EASY': 1, 'MEDIUM': 2, 'HARD': 3 };
    const totalDifficulty = tests.reduce((sum, test) => sum + difficultyValues[test.difficultyLevel], 0);
    const avg = totalDifficulty / tests.length;
    setAverageDifficulty(avg.toFixed(2));

    
    const difficultyCounts = tests.reduce((counts, test) => {
      counts[test.difficultyLevel] = (counts[test.difficultyLevel] || 0) + 1;
      return counts;
    }, {});

    
    const mostCommon = Object.entries(difficultyCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    setMostCommonDifficulty(mostCommon);
  };

  useEffect(() => {
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
        setFilteredTests(response.data);
        calculateTestStatistics(response.data);
      } catch (error) {
        console.error('Error fetching test details:', error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedDifficulty === 'ALL') {
      setFilteredTests(tests);
    } else {
      setFilteredTests(tests.filter(test => test.difficultyLevel === selectedDifficulty));
    }
  }, [selectedDifficulty, tests]);

  const handleShow = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    saveInput(username);
    setUsername('');
    setShowModal(false);
  };

  const saveInput = async (username) => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        console.error('No JWT token found');
        return;
    }
    
    try {
        const assignUserData = await axios.get(`http://localhost:9900/user/get/${username}`, selectedTest, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

       if(assignUserData.data.userRole !== "USER"){
         alert("Test will be assigned to only Users. Try a different one!!");
         return;
       }

        const response = await axios.post(`http://localhost:9900/user/assign/${username}`, selectedTest, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const emailData = {
          from_name: 'rohan.rana.7351@gmail.com', 
          to_name: assignUserData.data.email, 
          subject: 'Test Assignment Notification',
          message: `Test assigned successfully:\n\nTitle: ${selectedTest.title}\nCategory: ${selectedTest.category}\nDifficulty Level: ${selectedTest.difficultyLevel}\nDuration: ${selectedTest.duration} minutes\nPassing Score: ${selectedTest.passingScore} \nExam Start Time: ${selectedTest.startTime}`,
          reply_to: 'rohan.rana.7351@gmail.com'
        };

        await emailjs.send(config.emailJs.serviceId, config.emailJs.templateId, emailData, config.emailJs.userId);

        console.log('Test assigned successfully:', response.data);
        alert(`Assigned test ID ${selectedTest.id} to ${username}`);
    } catch (error) {
        console.error('Error assigning test:', error);
    }
  };

  const handleCopy = async (test) => {
    if(test==null) return ;

    const { id, ...testWithoutId } = test;

    const copyjson = JSON.stringify(testWithoutId, null, 2);
    const jwtToken = localStorage.getItem('jwtToken');
     const res = window.confirm("Are you sure to copy the test details");
     console.log(test);
     console.log(testWithoutId);
     if(res==false)
       return;

     try{
      const { id, questions, ...testWithoutId } = test;

      const questionsWithoutId = questions.map(({ id, ...questionWithoutId }) => questionWithoutId);

      const modifiedTest = {
        ...testWithoutId,
        questions: questionsWithoutId
      };

      const response = await axios.post('http://localhost:9900/test/insert', modifiedTest, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      })
     console.log('Response:', response.data);
     }
     catch (error) {
      console.error('Error copying test:', error);
  }
  };

  return (
    <Container className="creator-page">
      <h1 className="creator-page__title my-5">Created Tests List</h1>
      
      <div className="creator-page__statistics mb-4">
        <h4>Test Statistics</h4>
        <p>Average Difficulty: {averageDifficulty} 
          ({averageDifficulty < 1.5 ? 'Easy' : averageDifficulty < 2.5 ? 'Medium' : 'Hard'})
        </p>
        {/* <p>Most Common Difficulty: {mostCommonDifficulty}</p> */}
      </div>

      <div className="creator-page__filter mb-4">
        <Form.Group controlId="difficultyLevel">
          <Form.Label><FaFilter className="me-2" />Filter by Difficulty Level</Form.Label>
          <Form.Select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </Form.Select>
        </Form.Group>
      </div>

      <Row className="creator-page__test-cards">
        {filteredTests.map((test) => (
          <Col key={test.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="creator-page__test-card">
              <h5 className="creator-page__test-card-title">{test.title || "Untitled Test"}</h5>
              <p><strong>Category:</strong> {test.category}</p>
              <p><strong>Difficulty:</strong> {test.difficultyLevel}</p>
              <p><strong>Duration:</strong> {test.duration} minutes</p>
              <p><strong>Passing Score:</strong> {test.passingScore}</p>
              <div className="creator-page__test-card-actions">
                <Button variant="primary" onClick={() => handleShow(test)}>
                  <FaUserPlus className="me-2" />Assign
                </Button>
                <Button variant="secondary" onClick={() => handleCopy(test)}>
                  <FaCopy className="me-2" />Copy
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreatorPage;