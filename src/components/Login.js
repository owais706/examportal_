import React, { useState } from 'react';
import { useAuth } from './AuthContest';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {

  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let formErrors = {};
    if (!formData.username) {
      formErrors.username = 'Username is required.';
    }
  
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:9900/login', {
        Username: formData.username,
        password: formData.password
      });

      // localStorage.removeItem('jwtToken');

      localStorage.setItem('jwtToken', response.data);
  
      const userInfo = await axios.get(`http://localhost:9900/user/get/${formData.username}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.data}`
        }
      });
      localStorage.setItem('userInfo', JSON.stringify(userInfo.data));
      login();
      const userRole = userInfo.data.userRole;
      console.log(userInfo)
      console.log(userInfo.data);
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userRole === 'CREATER') {
        navigate('/creator/dashboard');
      } else if (userRole === 'USER') {
        navigate('/user/dashboard');
      } else {
       alert(`User role is ${userInfo}`);
      }
    } catch (error) {
      setLoginError('Invalid username or password. Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-form-group">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && <p className="error">{errors.username}</p>}
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
          </div>
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit">Sign In</button>
        </form>
        <p>
          New user? <a href="http://localhost:3000/signup" className="signup">Click here.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
