import React from 'react';
import { useAuth } from './AuthContest';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn) {
        localStorage.setItem('isLoggedIn', true);
    }
    const navigate = useNavigate();
    
    const location = useLocation();
    const hiddenRoutes = ['/take-test']; 
    const shouldHideNav = hiddenRoutes.includes(location.pathname);
    
    if (shouldHideNav) {
        return null; 
    }

    const handleDashboardClick = () => {
        const userRole = JSON.parse(localStorage.getItem('userInfo')).userRole;
        console.log(userRole)
        if (userRole === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (userRole === 'CREATER') {
            navigate('/creator/dashboard');
        } else if (userRole === 'USER') {
            navigate('/user/dashboard');
        } else {
            navigate('/homepage');
        }
    };
  
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="https://cdn.iconscout.com/icon/free/png-512/free-books-2720030-2265709.png?f=webp&w=256" alt="ExamZone Logo" height="50" className="d-inline-block align-top me-2" />
                    <span className="brand-name">ExamZone</span>
                </Link>
       
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><FaHome /> Home</Link>
                        </li>
                        {!localStorage.getItem('isLoggedIn') ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login"><FaSignInAlt /> Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup"><FaUserPlus /> Signup</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="#!" onClick={handleDashboardClick}>
                                        <FaTachometerAlt /> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile"><FaUserCircle /> Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/logout"><FaSignOutAlt /> Logout</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;