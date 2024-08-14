// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContest';
import CreateTest from './components/CreateTest';
import AddQuestions from './components/AddQuestions';
import HomePage from './components/HomePage';
import TestPage from './components/TestPage';
import Profile from './components/ProfilePage';
import Login from './components/Login';
import Logout from './components/Logout';
import SignUp from './components/SignUp';
import SubmitPage from './components/SubmitPage';
import AdminDashboard from './components/AdminDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import UserDashboard from './components/UserDashboard';
// import ManageTests from './components/ManageTests';
// import ViewResults from './components/ViewResult';
import CreatorPage from './components/CreatorPage';
import Navigation from './components/Navbar';
import TestList from './components/TestList';
import UserList from './components/UserList';
import CreatorList from './components/CreatorList';
import CreateUser from './components/CreateUser';

function App() {
  return (/*  */
    <AuthProvider>
    <Router>
      <Navigation />
            <div className="container mt-4">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/addquestions" element={<AddQuestions />} />
        {/* <Route path="/taketest" element={<TakeTest />} /> */}
        {/* <Route path='/testcontainer' element={<TestContainer/>}/> */}
        <Route path='/take-test' element={<TestPage/>}/>
        <Route path='/homepage' element={<HomePage/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard/> } />
        <Route path='/creator/dashboard' element={<CreatorDashboard/>}/>
        <Route path='/user/dashboard' element={<UserDashboard/>}/>
        <Route path='/creator/test-list' element={<CreatorPage/>}/>
        <Route path="/creator/create-test" element={<CreateTest/>} />
        <Route path="/admin/create-user" element={<CreateUser/>} />
        <Route path="/admin/users" element={<UserList/>} />
        <Route path="/admin/creators" element={<CreatorList/>} />
        <Route path="/admin/tests" element={<TestList/>} />

        {/* <Route path="/admin/manage-tests" component={ManageTests} /> */}
        {/* <Route path="/admin/view-results" component={ViewResults} /> */}
      
      </Routes>

      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
