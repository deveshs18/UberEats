const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Restaurant = require('./Restaurant');
const Customer = require('./Customer');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Customer',
      key: 'id',
    },
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
  tableName: 'Favorites',
  timestamps: true,
});

// Define associations directly
Favorite.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Favorite.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = Favorite;