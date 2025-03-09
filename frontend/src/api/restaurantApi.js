import axios from 'axios';

const API_URL = 'http://localhost:5000/api/restaurants';

// ✅ Fetch all restaurants
export const fetchRestaurants = async (setRestaurants) => {
    try {
        const res = await axios.get(API_URL);
        setRestaurants(res.data);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
    }
};
