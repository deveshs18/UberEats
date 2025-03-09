import axios from "axios";

// ✅ Updated API endpoint
const API_URL = "http://localhost:5000/api/restaurants";

/**
 * Fetches restaurants from the backend API
 * @param {Function} setRestaurants - State setter function to update restaurant data
 */
export const fetchRestaurants = async (setRestaurants) => {
    try {
        const response = await axios.get(API_URL);
        setRestaurants(response.data);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
    }
};
