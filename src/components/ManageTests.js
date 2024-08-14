import React, { useState } from 'react';
// import './ManageTests.css';

const ManageTests = () => {
  const [tests, setTests] = useState([
    { id: 1, title: 'Technical Test', difficultyLevel: 'MEDIUM' },
    { id: 2, title: 'Aptitude Test', difficultyLevel: 'MEDIUM' }
  ]);

  return (
    <div className="manage-tests">
      <h1>Manage Tests</h1>
      <button className="add-test-button">Add New Test</button>
      <ul>
        {tests.map(test => (
          <li key={test.id}>
            <h2>{test.title}</h2>
            <p>Difficulty Level: {test.difficultyLevel}</p>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTests;
