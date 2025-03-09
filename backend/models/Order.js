const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Order = sequelize.define('Order', {
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
  status: {
    type: DataTypes.ENUM('New', 'Preparing', 'On the Way', 'Pick-up Ready', 'Delivered', 'Picked Up', 'Cancelled'),
    defaultValue: 'New',
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    get() {
      const value = this.getDataValue('total_amount');
      return value === null ? null : parseFloat(value);
    }
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
    defaultValue: 'Pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Order',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Order;
