import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

// List of countries
const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "India", 
    "Germany", "France", "Japan", "Brazil", "Mexico"
];

// US States abbreviations
const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const Profile = ({ setUserName }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        country: '',
        state: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/customers/profile', {
                withCredentials: true
            });
            setProfile(response.data);
            if (response.data.profilePicture) {
                setImagePreview(response.data.profilePicture);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setProfile(prev => ({
                    ...prev,
                    profilePicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.put('http://localhost:5000/api/customers/profile', profile, {
                withCredentials: true
            });
            
            // Update the userName in the parent component (App.js)
            if (response.data && response.data.name) {
                setUserName(response.data.name);
            } else {
                setUserName(profile.name); // Fallback to the current profile name
            }
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;

    return (
        <div className="profile-container">
            <h1>Profile Settings</h1>
            
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-picture-section">
                    <div className="profile-picture">
                        <img 
                            src={imagePreview || 'https://via.placeholder.com/150'} 
                            alt="Profile" 
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="profile-picture-input"
                        />
                        <label htmlFor="profile-picture-input">
                            Change Picture
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Country</label>
                    <select
                        name="country"
                        value={profile.country}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>State</label>
                    <select
                        name="state"
                        value={profile.state}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select State</option>
                        {usStates.map(state => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="save-button">
                    Save Changes
                </button>

                {success && (
                    <div className="success-message">
                        Profile updated successfully!
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
