const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_info: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timings: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  cuisine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  delivery_time: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  price_range: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'Restaurant',
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: 'updated_at',
});

module.exports = Restaurant;
