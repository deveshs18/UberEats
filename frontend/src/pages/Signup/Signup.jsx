// src/pages/Signup/Signup.jsx
import React from 'react';
import './Signup.css';
import SignupForm from './Signup.js'; // ✅ Correct Import

const Signup = () => {
    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <SignupForm />
        </div>
    );
};

export default Signup;
