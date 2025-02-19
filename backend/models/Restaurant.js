const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import Sequelize instance

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
    type: DataTypes.JSON, // JSON type to store flexible timing information
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true, // Profile picture URL, nullable
  },
}, {
  tableName: 'Restaurant',
  timestamps: true, // Enable Sequelize timestamps
  createdAt: 'created_at', // Map Sequelize's createdAt to 'created_at' in DB
  updatedAt: 'updated_at', // Map Sequelize's updatedAt to 'updated_at' in DB
});

module.exports = Restaurant;
