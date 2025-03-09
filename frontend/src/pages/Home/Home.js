import axios from 'axios';

// ✅ Fetch featured restaurants from the backend
export const getFeaturedRestaurants = async (setRestaurants) => {
    try {
        const res = await axios.get('http://localhost:5000/restaurants/featured');  // API request
        setRestaurants(res.data);  // Update React state
    } catch (error) {
        console.error("Error fetching restaurants", error);
    }
};
