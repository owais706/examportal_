import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { FaCalendarAlt,FaBook,FaClipboardList, FaUserCircle, FaSignOutAlt, FaClock, FaFolder } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('Error fetching test details:', error);
            }
        };

        fetchTests();
    }, []);

    const shuffleArray = (array) => {
        let shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const handleTakeTest = (test) => {
        const shuffledQuestions = shuffleArray(test.questions);
        const durationMap = { [test.id]: test.duration };
        localStorage.setItem('durationMap', JSON.stringify(durationMap));
    
        const startTime = Date.now();
        localStorage.removeItem('timeLeft');
        localStorage.setItem('testStartTime', startTime);
    
        const shuffledTest = {
            ...test,
            questions: shuffledQuestions
        };
    
        navigate('/take-test', { state: { testDetails: shuffledTest } });
    };

    return (
        <Container fluid className="user-dashboard-container">
            <Row className="user-dashboard-header">
                <Col>
                    <h1><FaClipboardList /> Welcome to Your Dashboard</h1>
                </Col>
            </Row>
            <Row className="user-dashboard-main">
                <Col>
                    <Card className="mb-4">
                        <Card.Header as="h2">Your Assigned Tests</Card.Header>
                        <ListGroup variant="flush">
                            {tests.length > 0 ? (
                                tests.map((test) => (
                                    <ListGroup.Item key={test.id} className="test-item">
                                        <h3>{test.title}</h3>
                                        <p><FaBook /> Name: {test.title} </p>
                                        <p><FaFolder /> Category: {test.category}</p>
                                        <p><FaClock /> Duration: {test.duration} minutes</p>
                                        <p><FaCalendarAlt /> Scheduled Time: {test.startTime} </p>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleTakeTest(test)}
                                        >
                                            Take Test
                                        </Button>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>No tests assigned yet.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <Row className="user-dashboard-actions">
                <Col className="text-center">
                    <Link to="/profile">
                        <Button variant="info" className="me-3">
                            <FaUserCircle /> Update Profile
                        </Button>
                    </Link>
                    <Link to="/logout">
                        <Button variant="danger">
                            <FaSignOutAlt /> Logout
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row className="user-dashboard-footer">
                <Col>
                    <p>&copy; 2024 Test Portal. All rights reserved.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDashboard;