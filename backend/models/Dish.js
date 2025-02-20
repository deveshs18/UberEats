const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import Sequelize instance
const Restaurant = require('./Restaurant'); // Import Restaurant model for the association

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('Appetizer', 'Main Course', 'Dessert', 'Drink', 'Other'),
    allowNull: false,
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Restaurant',
      key: 'id',
    },
  },
}, {
  tableName: 'Dish',
  timestamps: false, 
});

Dish.belongsTo(Restaurant, { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });

module.exports = Dish;
