// src/pages/Profile/ProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = ({ userData }) => {
    const [profilePic, setProfilePic] = useState(userData.profilePic || '');
    const [name, setName] = useState(userData.name || '');
    const [email, setEmail] = useState(userData.email || '');
    const [country, setCountry] = useState(userData.country || '');
    const [state, setState] = useState(userData.state || '');
    const [orderHistory, setOrderHistory] = useState(userData.orderHistory || []);

    const handleImageUpload = (e) => {
        setProfilePic(URL.createObjectURL(e.target.files[0]));
    };

    const handleUpdate = () => {
        axios.put('/api/profile', { name, email, country, state, profilePic })
            .then(response => alert('Profile updated successfully'))
            .catch(error => console.error('Error updating profile:', error));
    };

    return (
        <div className="profile-form">
            <div className="profile-picture">
                <img src={profilePic || '/assets/default-profile.png'} alt="Profile" />
                <input type="file" onChange={handleImageUpload} />
            </div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
            </select>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State (abbreviated)" />
            <button className="btn" onClick={handleUpdate}>Update Profile</button>
            <h3>Order History</h3>
            {orderHistory.length === 0 ? <p>No orders yet.</p> : <ul>{orderHistory.map((order, index) => <li key={index}>{order}</li>)}</ul>}
        </div>
    );
};

export default ProfileForm;