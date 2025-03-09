import axios from 'axios';

// ✅ Fetch all orders from the backend
export const getOrders = async (setOrders) => {
    try {
        const res = await axios.get('http://localhost:5000/orders');  // API request
        setOrders(res.data);  // Update orders state in React
    } catch (error) {
        console.error("Error fetching orders", error);
    }
};

// ✅ Update order status (For restaurant owners)
export const updateOrderStatus = async (orderId, status, setOrders) => {
    try {
        await axios.put(`http://localhost:5000/orders/${orderId}`, { status });  // API request
        getOrders(setOrders);  // Refresh orders after updating
    } catch (error) {
        console.error("Error updating order status", error);
    }
};
