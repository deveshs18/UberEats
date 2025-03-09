import axios from 'axios';

const API_URL = 'http://localhost:5000/api/restaurants';

export const getDishes = async (restaurantId) => {
    try {
        const res = await axios.get(`${API_URL}/${restaurantId}/dishes`);
        return res.data;
    } catch (error) {
        console.error("Error fetching dishes:", error);
        return [];
    }
};
