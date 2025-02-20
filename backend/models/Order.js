const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Customer = require('./Customer');
const Restaurant = require('./Restaurant');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Restaurant,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM( // Adjust these States as needed
      'New',
      'Preparing',
      'On the Way',
      'Pick-up Ready',
      'Delivered',
      'Picked Up',
      'Cancelled'
    ),
    allowNull: false,
    defaultValue: 'New',
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
    tableName: 'Order',
    timestamps: true,
    createdAt: 'created_at',  
    updatedAt: 'updated_at', 
});

Order.belongsTo(require('./Customer'), { foreignKey: 'customer_id' });
Order.belongsTo(require('./Restaurant'), { foreignKey: 'restaurant_id' });

module.exports = Order;
