const Customer = require('../models/Customer');
const Favorite = require('../models/Favorite');
const Restaurant = require('../models/Restaurant');

// Get the authenticated user's profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.session.user.id;

    // Use Sequelize's findByPk method
    const customer = await Customer.findByPk(userId);

    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive information before sending
    const userProfile = customer.toJSON();
    delete userProfile.password;

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

// Update the authenticated user's profile
exports.updateProfile = async (req, res) => {
    try {
      if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const userId = req.session.user.id;
      const { name, profilePicture, country, state } = req.body;
  
      const customer = await Customer.findByPk(userId);
      if (!customer) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the customer details
      await customer.update({ name, profilePicture, country, state, updatedAt: new Date() });
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  
// Get the user's favorite restaurants
exports.getFavorites = async (req, res) => {
    try {
      if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const userId = req.session.user.id;
  
      // Retrieve the user's favorite restaurants
      const favorites = await Favorite.findAll({
        where: { customer_id: userId },
        include: [{
            model: Restaurant,
            as: 'Restaurant', // Ensure this matches the association alias if used
          }],
      });
  
      res.status(200).json(favorites);
    } catch (error) {
      console.error('Error retrieving favorites:', error);
      res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
    }
};

// Add a restaurant to favorites
exports.addFavorite = async (req, res) => {
    try {
      if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const userId = req.session.user.id;
      const restaurantId = parseInt(req.params.restaurantId, 10); // Convert to integer

      
      console.log('User ID:', userId);
      console.log('Restaurant ID:', restaurantId);

      // Add a new favorite
      await Favorite.create({ customer_id: userId, restaurant_id: restaurantId });
  
      res.status(201).json({ message: 'Restaurant added to favorites' });
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ message: 'Error adding favorite', error: error.message });
    }
};
  
// Remove a restaurant from favorites
exports.removeFavorite = async (req, res) => {
    try {
      if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      const userId = req.session.user.id;
      const restaurantId = parseInt(req.params.restaurantId, 10); // Convert to integer
      
      // Remove the favorite entry
      const favorite = await Favorite.findOne({
        where: { customer_id: userId, restaurant_id: restaurantId }
      });
  
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
  
      await favorite.destroy();
  
      res.status(200).json({ message: 'Restaurant removed from favorites' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ message: 'Error removing favorite', error: error.message });
    }
};
  