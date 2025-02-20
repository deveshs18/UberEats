const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

// Get restaurant profile
exports.getProfile = async (req, res) => {
  try {
    const restaurantId = req.session.user.id;
   
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error retrieving restaurant profile:', error);
    res.status(500).json({ message: 'Error retrieving restaurant profile', error: error.message });
  }
};

// Update restaurant profile
exports.updateProfile = async (req, res) => {
  try {
    const restaurantId = req.session.user.id;
    const { name, location, description, contactInfo, images, timings } = req.body;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.update({ name, location, description, contactInfo, images, timings });

    res.status(200).json({ message: 'Restaurant profile updated successfully' });
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    res.status(500).json({ message: 'Error updating restaurant profile', error: error.message });
  }
};


// Test Logic of before implementing this
/*
// Add or update dishes
exports.addOrUpdateDish = async (req, res) => {
  try {
    const restaurantId = req.session.user.id;
    const { dishId, name, ingredients, image, price, description, category } = req.body;

    let dish;

    if (dishId) {
      // Update existing dish
      dish = await Dish.findOne({ where: { id: dishId, restaurantId } });
      if (!dish) {
        return res.status(404).json({ message: 'Dish not found' });
      }
      await dish.update({ name, ingredients, image, price, description, category });
    } else {
      // Create new dish
      dish = await Dish.create({ restaurantId, name, ingredients, image, price, description, category });
    }

    res.status(200).json({ message: 'Dish saved successfully', dish });
  } catch (error) {
    console.error('Error saving dish:', error);
    res.status(500).json({ message: 'Error saving dish', error: error.message });
  }
};

// Get all dishes
exports.getDishes = async (req, res) => {
  try {
    const restaurantId = req.session.user.id;
    const dishes = await Dish.findAll({ where: { restaurantId } });

    res.status(200).json(dishes);
  } catch (error) {
    console.error('Error retrieving dishes:', error);
    res.status(500).json({ message: 'Error retrieving dishes', error: error.message });
  }
};
*/