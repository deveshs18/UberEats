const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

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
  tableName: 'Favorite',
  timestamps: false,
  uniqueKeys: {
    unique_favorite: {
      fields: ['customer_id', 'restaurant_id'],
    },
  },
});


Favorite.belongsTo(require('./Restaurant'), { foreignKey: 'restaurant_id' });

module.exports = Favorite;