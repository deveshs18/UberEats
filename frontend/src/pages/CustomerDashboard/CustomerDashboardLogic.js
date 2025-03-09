import { useState, useEffect } from 'react';

const CustomerDashboardLogic = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineTypes, setCuisineTypes] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:5000/api/restaurants';
        
        // Add query parameters if filters are applied
        const params = new URLSearchParams();
        if (selectedCuisine) params.append('cuisine', selectedCuisine);
        if (searchQuery) params.append('search', searchQuery);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch restaurants');
        
        const data = await response.json();
        setRestaurants(data);

        // Extract unique cuisine types
        const uniqueCuisines = [...new Set(data.map(restaurant => restaurant.cuisine))];
        setCuisineTypes(uniqueCuisines);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCuisine, searchQuery]);

  const handleSearch = () => {
    // The search will be triggered by the useEffect when searchQuery changes
    // This function is here in case we want to add additional search functionality
  };

  return {
    restaurants,
    loading,
    error,
    selectedCuisine,
    setSelectedCuisine,
    searchQuery,
    setSearchQuery,
    handleSearch,
    cuisineTypes
  };
};

export default CustomerDashboardLogic; 