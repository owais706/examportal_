import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'phoneNumber') {
      if (!/^\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: 'Enter a valid phone number. Only numbers are allowed.',
        }));
      } else if (value.length < 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: 'Phone number must be at least 10 characters long.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: '',
        }));
      }
    } else if (name === 'firstName' || name === 'lastName') {
      if (/[^a-zA-Z]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Only alphabetic characters are allowed.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let formErrors = {};
  
    if (!formData.firstName.trim()) {
      formErrors.firstName = 'First name is required.';
    } else if (/[^a-zA-Z]/.test(formData.firstName)) {
      formErrors.firstName = 'Only alphabetic characters are allowed.';
    }
  
    if (!formData.lastName.trim()) {
      formErrors.lastName = 'Last name is required.';
    } else if (/[^a-zA-Z]/.test(formData.lastName)) {
      formErrors.lastName = 'Only alphabetic characters are allowed.';
    }
  
    const passwordValidationMessage = validatePassword(formData.password);
    if (passwordValidationMessage) {
      formErrors.password = passwordValidationMessage;
    }
  
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Invalid email address';
    }
  
    if (formData.phoneNumber.length < 10) {
      formErrors.phoneNumber = 'Phone number must be at least 10 characters long.';
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Enter a valid phone number. Only numbers are allowed.';
    }
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      userName: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
    };
    console.log(userData);
    console.log(JSON.stringify(userData));
  
    try {
      const response = await axios.post('http://localhost:9900/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('Response:', response.data);
  
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
  
      alert(`Registration successful! Welcome to Online Test Portal, User Name: ${formData.username}.`);
      alert('By clicking "OK," you will be redirected to the login page.');
  
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
      });
      navigate('/login'); 
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="sign-up-container">
      <h1>SIGN UP</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="first-name">First Name</label>
                <input 
                  type="text" 
                  id="first-name" 
                  name="firstName" 
                  placeholder="Enter your first name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
                {errors.firstName && <p className="error">{errors.firstName}</p>}
              </div>
            </div>
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="last-name">Last Name</label>
                <input 
                  type="text" 
                  id="last-name" 
                  name="lastName" 
                  placeholder="Enter your last name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Choose a username" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
            </div>
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirm-password" 
                  name="confirmPassword" 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone-number">Phone Number</label>
            <input 
              type="text" 
              id="phone-number" 
              name="phoneNumber" 
              placeholder="Enter your phone number" 
              value={formData.phoneNumber}
              onChange={handleChange}
              required 
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
