import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmitPage.css'; // Ensure you have styles defined here

const SubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testResult } = location.state || {};

  React.useEffect(() => {
    console.log('Test Result Data:', testResult);
    console.log(JSON.stringify(testResult));
  }, [testResult]);

  if (!testResult) {
    return <div>No test data available. Please take the test first.</div>;
  }

  const { testDetails, questions, totalScore } = testResult;
  const passingScore = parseInt(testDetails.passingScore, 10);
  const isPassed = totalScore >= passingScore;

  return (
    <div className="submit-page">
      <h1>Exam Result Details</h1>
      <div className="test-summary">
        <h2>{testDetails.title}</h2>
        <p>Total Score: {totalScore} / {questions.reduce((sum, q) => sum + parseInt(q.point, 10), 0)}</p>
        <p>Passing Score: {testDetails.passingScore}</p>
        <p>Duration: {testDetails.duration} minutes</p>
        <p>Category: {testDetails.category}</p>
        
        {/* Congratulatory message based on passing score */}
        <p className={isPassed ? 'passed' : 'failed'}>
          {isPassed ? 'Congrats! You Passed the exam.' : 'Better Luck Next Time.'}
        </p>
      </div>

      <div className="question-review">
        <h3>Question Review</h3>
        {questions.map((question, index) => {
          const isNotAttempted = !question.userAnswer;
          const isCorrect = question.userAnswer === question.correctOption || question.userAnswer === question.correctAnswer;
          
          return (
            <div key={index} className="question-item">
              <p><strong>Question {index + 1}:</strong> {question.text}</p>
              <p className={isNotAttempted ? 'not-attempted' : isCorrect ? 'correct-answer' : 'incorrect-answer'}>
                Your Answer: {isNotAttempted ? "Not attempted" : question.userAnswer}
              </p>
              {/* Show explanation if not attempted or incorrect */}
              {(isNotAttempted || !isCorrect) && question.explanation && (
                <p className="explanation">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              )}
              <p>Correct Answer: {question.correctOption || question.correctAnswer}</p>
              <p>Points: {question.point}</p>
            </div>
          );
        })}
      </div>

      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default SubmitPage;
