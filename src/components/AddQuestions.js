import React, { useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./AddQuestions.css";

const AddQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(location.state?.testDetails || {
    title: '',
    passingScore: '',
    duration: '',
    startTime: '',
    endTime: '',
    category: '',
    description: '',
    questions: []
  });

  const [showModal, setShowModal] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    type: "",
    point: "",
    text: "",
    options: [""],
    correctOption: "",
    correctAnswer: "",
     explanation: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!questionForm.type) newErrors.type = "Question type is required";
    if (!questionForm.point) newErrors.point = "Points are required";
    if (!questionForm.text) newErrors.text = "Question text is required";
    if (questionForm.type === "MCQ") {
      if (questionForm.options.some(option => option === "")) newErrors.options = "All options must be filled";
      if (!questionForm.correctOption) newErrors.correctOption = "Correct option is required";
    }
    if (questionForm.type === "TF" && !questionForm.correctOption) newErrors.correctOption = "Correct answer is required";
    if (questionForm.type === "FITB" && !questionForm.correctAnswer) newErrors.correctAnswer = "Correct answer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [questionForm]);

  const handleQuestionFormChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = () => {
    setShowModal(true);
  };

  const handleSaveQuestion = () => {
    if (!validateForm()) return;
  
    const newQuestion = {
      type: questionForm.type,
      point: questionForm.point,
      text: questionForm.text,
      options: questionForm.type === "MCQ" ? questionForm.options.filter(option => option !== "") : 
               questionForm.type === "TF" ? ["true", "false"] : [""],
      correctOption: questionForm.type === "MCQ" || questionForm.type === "TF" ? questionForm.correctOption : undefined,
      correctAnswer: questionForm.type === "FITB" ? questionForm.correctAnswer : undefined,
      explanation: questionForm.explanation,  // Add explanation here
    };
  
    setTestDetails(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  
    setShowModal(false);
    setQuestionForm({
      type: "",
      point: "",
      text: "",
      options: [""],
      correctOption: "",
      correctAnswer: "",
      explanation: "",  // Reset explanation
    });
    setErrors({});
    console.log(JSON.stringify(testDetails))
  };
  

  const handleOptionChange = (index, value) => {
    setQuestionForm(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleAddOption = () => {
    setQuestionForm(prev => ({ ...prev, options: [...prev.options, ""] }));
  };

  const handleRemoveOption = (index) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleNavigateToDetails = async() => {

    try {

      const jwtToken = localStorage.getItem('jwtToken');

     const response = await axios.post('http://localhost:9900/test/insert', testDetails, {
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${jwtToken}`
       }
     })
    console.log('Response:', response.data);
 
     if (!response.ok) {
       throw new Error('Network response was not ok');
     }
 
 }catch (error) {
     console.log('Please try again.');
     console.error('request failed:', error);
   }

    navigate('/creator/dashboard');
  };

  return (
    <div className="create-test">
      <h2>Exam Details</h2>
      <div className="test-details-page">
        <div className="header">
          <h1>Exam Name - {testDetails.title}</h1>
        </div>
        <div className="test-info">
          <p><strong>Description:</strong> {testDetails.description}</p>
          <p><strong>Exam Category:</strong> {testDetails.category}</p>
          <p><strong>Difficulty level:</strong> {testDetails.difficultyLevel}</p>
          <p><strong>Duration:</strong> {testDetails.duration} minutes</p>
          <p><strong>Start Time:</strong> {new Date(testDetails.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(testDetails.endTime).toLocaleString()}</p>
          <p><strong>Passing Score:</strong> {testDetails.passingScore}</p>
        </div>

        <Button onClick={handleAddQuestion}>Add Question</Button>
        
        {testDetails.questions.length > 0 && (
          <div className="questions">
            <h2>Questions</h2>
            {testDetails.questions.map((question, index) => (
              <div key={index} className="question">
                <p><strong>Question {index + 1}:</strong> {question.text}</p>
                <p><strong>Points:</strong> {question.point}</p>
                {question.type === 'MCQ' && (
                  <div className="options">
                    <p><strong>Options:</strong></p>
                    <ul>
                      {question.options.map((option, idx) => (
                        <li key={idx} className={option === question.correctOption ? 'correct-option' : ''}>
                          <span style={{ color: 'black' }}>{idx + 1}.</span> {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {question.type === 'TF' && (
                  <div className="TF">
                    <div className="options">
                      <p><strong>Options:</strong></p>
                      <ul>
                        {question.options.map((option, idx) => (
                          <li key={idx} className={option === question.correctOption ? 'correct-option' : ''}>
                            <span style={{ color: 'black' }}>{idx + 1}.</span> {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {question.type === 'FITB' && (
                  <div className="FITB">
                    <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Question no.{testDetails.questions.length + 1}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <form>
    <div className="form-row">
      <div className="form-group">
        <label>Question Type</label>
        <select name="type" value={questionForm.type} onChange={handleQuestionFormChange}>
          <option value="">Select Type</option>
          <option value="MCQ">Multiple Choice</option>
          <option value="TF">True/False</option>
          <option value="FITB">Fill in the Blank</option>
        </select>
        {errors.type && <p className="error">{errors.type}</p>}
      </div>
      <div className="form-group">
        <label>Points</label>
        <input type="number" name="point" value={questionForm.point} placeholder="Enter points" onChange={handleQuestionFormChange} />
        {errors.point && <p className="error">{errors.point}</p>}
      </div>
    </div>
    <div className="form-group">
      <label>Question</label>
      <input type="text" name="text" value={questionForm.text} placeholder="Enter your question details" onChange={handleQuestionFormChange} />
      {errors.text && <p className="error">{errors.text}</p>}
    </div>
    {questionForm.type === "MCQ" && (
      <div>
        <label>Options</label>
        {questionForm.options.map((option, index) => (
          <div key={index} className="option-item">
            <span>{String.fromCharCode(65 + index)}.</span>
            <input className="option-input" type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
            <button className="close-button" type="button" onClick={() => handleRemoveOption(index)}>X</button>
          </div>
        ))}
        <Button onClick={handleAddOption}>Add Option</Button>
        {errors.options && <p className="error">{errors.options}</p>}
        <div className="form-group">
          <br></br><br></br>
          <label>Correct Option</label>
          <select name="correctOption" value={questionForm.correctOption} onChange={handleQuestionFormChange}>
            <option value="">Select Correct Option</option>
            {questionForm.options.map((option, index) => (
              <option key={index} value={option}>{String.fromCharCode(65 + index)}</option>
            ))}
          </select>
          {errors.correctOption && <p className="error">{errors.correctOption}</p>}
        </div>
      </div>
    )}
    {questionForm.type === "TF" && (
      <div className="true-false">
        <label>Correct Answer</label>
        <select name="correctOption" value={questionForm.correctOption} onChange={handleQuestionFormChange}>
          <option value="">Select Correct Answer</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        {errors.correctOption && <p className="error">{errors.correctOption}</p>}
      </div>
    )}
    {questionForm.type === "FITB" && (
      <div>
        <label>Correct Answer</label>
        <input type="text" name="correctAnswer" value={questionForm.correctAnswer} onChange={handleQuestionFormChange} />
        {errors.correctAnswer && <p className="error">{errors.correctAnswer}</p>}
      </div>
    )}
    <div className="form-group">
      <label>Explanation</label>
      <textarea name="explanation" value={questionForm.explanation} placeholder="Enter explanation" onChange={handleQuestionFormChange} />
    </div>
  </form>
</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveQuestion}>Save Question</Button>
        </Modal.Footer>
      </Modal>
      
      <Button className="button-create-test" onClick={handleNavigateToDetails}>Create Test and Go to Dashboard</Button>

    </div>
  );
};

export default AddQuestions;