import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateTest.css';

const CreateTest = () => {
    const navigate = useNavigate();
    const [testDetails, setTestDetails] = useState({
        title: '',
        passingScore: '',
        duration: '',
        startTime: '',
        endTime: '',
        category: '',
        description: '',
        difficultyLevel: '',
        questions: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        navigate('/addquestions', { state: { testDetails } });

};

    return (
        <div className="main-container">
            <div className="create-test-container">
                <div className="image-container">
                    <img src="https://64.media.tumblr.com/91b0a582f92bffd85dafeabf80fd7bd1/tumblr_p4y9droeIE1ud1v24o1_1280.jpg" alt="Exam" />
                    <div className="image-overlay">
                        <h2>#work</h2>
                    </div>
                </div>
                <div className="form-container">
                    <h2 className="form-title">Create Test</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input 
                                type="text" 
                                className='input'
                                name="title" 
                                placeholder='Exam Name'
                                value={testDetails.title} 
                                onChange={handleChange} 
                                required 
                            />
                            <select 
                                name="category" 
                                value={testDetails.category} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="" disabled>Select Exam Category</option>
                                <option value="APTITUDE">Aptitude</option>
                                <option value="TECHNICAL">Technical</option>
                                <option value="REASONING">Reasoning</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <input 
                                type="number" 
                                name="passingScore" 
                                className='input'
                                placeholder='Passing Score'
                                value={testDetails.passingScore} 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type="number" 
                                name="duration" 
                                className='input'
                                placeholder='Duration (in minutes)'
                                value={testDetails.duration}
                                onChange={handleChange} 
                                required 
                            />
                            <select 
                                name="difficultyLevel" 
                                value={testDetails.difficultyLevel} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="" disabled>Choose Difficulty</option>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="datetime-input">
                                <label htmlFor="startTime">Start Time</label>
                                <input 
                                    type="datetime-local" 
                                    id="startTime" 
                                    name="startTime" 
                                    className='input'
                                    value={testDetails.startTime} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="datetime-input">
                                <label htmlFor="endTime">End Time</label>
                                <input 
                                    type="datetime-local" 
                                    className='input'
                                    id="endTime" 
                                    name="endTime" 
                                    value={testDetails.endTime} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                        <textarea 
                            name="description" 
                            placeholder="Description"
                            value={testDetails.description} 
                            onChange={handleChange} 
                            required
                        ></textarea>
                        <button type="submit" className="submit-btn">Create Test</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTest;