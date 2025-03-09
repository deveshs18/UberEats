const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Order',
      key: 'id',
    },
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Dish',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price_at_time: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  special_instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'OrderItem',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define associations function to be called after all models are loaded
OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'parentOrder' });
  OrderItem.belongsTo(models.Dish, { foreignKey: 'dish_id' });
};

module.exports = OrderItem; 