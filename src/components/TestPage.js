import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaClock, FaCheck, FaTimes, FaBookmark, FaArrowRight, FaTrash } from 'react-icons/fa';
import './TestPage.css';

const TestPage = () => {
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem('timeLeft');
    return storedTime ? parseInt(storedTime, 10) : parseInt(testDetails.duration, 10) * 60 || 0;
  });
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [isExamAccessible, setIsExamAccessible] = useState(true);

  const [testResult, setTestResult] = useState({
    testDetails: { ...testDetails },
    questions: testDetails.questions.map(q => ({ ...q, userAnswer: '' })),
    totalScore: 0
  });

  useEffect(() => {
    const checkExamAccessibility = () => {
      const now = new Date();
      const startTime = new Date(testDetails.startTime);
      const endTime = new Date(testDetails.endTime);
      return now >= startTime && now <= endTime;
    };
  
    const accessible = checkExamAccessibility();
    setIsExamAccessible(accessible);
  
    if (accessible) {
      const storedTime = localStorage.getItem('timeLeft');
      const initialTime = storedTime ? parseInt(storedTime, 10) : parseInt(testDetails.duration, 10) * 60;
  
      setTimeLeft(initialTime);
  
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem('timeLeft');
            handleSubmitTest();
            return 0;
          }
          const newTime = prevTime - 1;
          localStorage.setItem('timeLeft', newTime.toString());
          return newTime;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    } else {
      localStorage.removeItem('timeLeft');
    }
  }, [testDetails]);

  const calculateScore = useCallback(() => {
    const correctAnswers = testResult.questions.reduce((totalPoints, question) => {
      if (
        (question.type === 'MCQ' || question.type === 'TF') && 
        question.userAnswer === question.correctOption
      ) {
        return totalPoints + parseInt(question.point, 10);
      }
      if (question.type === 'FITB' && question.userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase()) {
        return totalPoints + parseInt(question.point, 10);
      }
      return totalPoints;
    }, 0);

    setTestResult(prev => ({
      ...prev,
      totalScore: correctAnswers
    }));
  }, [testResult.questions]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore]);

  useEffect(() => {
    setVisitedQuestions(prev => ({ ...prev, 0: true }));
  }, []);

  const handleAnswerChange = (answer) => {
    setTestResult(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === currentQuestionIndex ? { ...q, userAnswer: answer } : q
      )
    }));
  };

  const handleQuestionChange = (index) => {
    if (index >= 0 && index < testResult.questions.length) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => ({ ...prev, [index]: true }));
    }
  };

  const handleClearResponse = () => {
    handleAnswerChange('');
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: false,
    }));
  };

  const handleMarkForReviewAndNext = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: true,
    }));
    handleQuestionChange(currentQuestionIndex + 1);
  };

  const handleSaveAndNext = () => {
    const currentQuestion = testResult.questions[currentQuestionIndex];
    const currentAnswer = currentQuestion.userAnswer;

    if (currentQuestion.type === 'FITB' && !currentAnswer) {
      alert('Please fill in the answer before saving and moving to the next question.');
      return;
    }

    if ((currentQuestion.type === 'MCQ' || currentQuestion.type === 'TF') && !currentAnswer) {
      alert('Please select an option before saving and moving to the next question.');
      return;
    }

    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: false,
    }));

    const nextIndex = (currentQuestionIndex + 1) % testResult.questions.length;
    handleQuestionChange(nextIndex);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitTest = () => {
    calculateScore();
    console.log('Test Result:', testResult);
    const userConfirmed = window.confirm("Are you sure you want to proceed?");
        
    if (userConfirmed) {
      console.log("User confirmed");
      localStorage.removeItem('timeLeft');
      navigate('/submit', { state: { testResult } });
    } else {
      console.log("User canceled");
    }
  };

  if (!isExamAccessible) {
    return <div className="container"><h1>The exam is not accessible at this time.</h1></div>;
  }

  const currentQuestion = testResult.questions[currentQuestionIndex] || {};

  return (
    <div className="test-page-container">
      <header className="test-page-header">
        <h1>{testDetails?.title || 'Test'}</h1>
        <div className="test-page-timer">
          <FaClock /> {formatTime(timeLeft) || 'N/A'}
        </div>
      </header>

      <div className="test-page-content">
        <div className="test-page-question-area">
          <div className="test-page-navigation-bar">
            <div className="test-page-question-number">
              Question No. {currentQuestionIndex + 1}
            </div>
            <div className="test-page-question-details">
              <span>Points: {currentQuestion.point || 0}</span>
            </div>
          </div>

          <div className="test-page-question-display">
            <p>{currentQuestion.text || 'No question available'}</p>

            {currentQuestion.type === 'MCQ' && (
              <div className="test-page-options">
                {(currentQuestion.options || []).map((option, index) => (
                  <label key={index} className={`test-page-option ${currentQuestion.userAnswer === option ? 'test-page-selected' : ''}`}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={currentQuestion.userAnswer === option}
                      onChange={() => handleAnswerChange(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'TF' && (
              <div className="test-page-options">
                {['true', 'false'].map((option, index) => (
                  <label key={index} className={`test-page-option ${currentQuestion.userAnswer === option ? 'test-page-selected' : ''}`}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={currentQuestion.userAnswer === option}
                      onChange={() => handleAnswerChange(option)}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'FITB' && (
              <input
                type="text"
                value={currentQuestion.userAnswer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="test-page-input"
                placeholder="Type your answer here"
              />
            )}
          </div>

          <div className="test-page-action-buttons">
            <button className="test-page-clear-response-button" onClick={handleClearResponse}>
              <FaTrash /> Clear Response
            </button>
            <button className="test-page-mark-for-review-button" onClick={handleMarkForReviewAndNext}>
              <FaBookmark /> Mark for Review and Next
            </button>
            <button className="test-page-save-and-next-button" onClick={handleSaveAndNext}>
              <FaArrowRight /> Save and Next
            </button>
            <button className="test-page-submit-button" onClick={handleSubmitTest}>
              Submit Test
            </button>
          </div>
        </div>

        <div className="test-page-side-panel">
          <div className="test-page-user-info">
            <div className="test-page-avatar">
              <FaUser />
            </div>
            <span>{JSON.parse(localStorage.getItem('userInfo'))?.userName || 'User'}</span>
          </div>

          <div className="test-page-navigation-panel">
            <h3>SECTION: Test</h3>
            <div className="test-page-question-grid">
              {testResult.questions.map((_, index) => (
                <button
                  key={index}
                  className={`test-page-question-button ${
                    visitedQuestions[index]
                      ? markedForReview[index]
                        ? 'test-page-marked-for-review'
                        : _.userAnswer
                        ? 'test-page-answered'
                        : 'test-page-visited-but-not-answered'
                      : ''
                  }`}
                  onClick={() => handleQuestionChange(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;