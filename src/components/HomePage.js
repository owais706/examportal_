import React from 'react';
import './HomePage.css';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Welcome to ExamZone</h1>
          <p>Discover amazing features and content tailored just for you. Join our community today and start your journey!</p>
          <a href="/login" className="btn btn-primary btn-lg">Get Started</a>
        </div>
      </section>
      {/* Add more sections for your home page content here */}
    </div>
  );
};

export default Home;