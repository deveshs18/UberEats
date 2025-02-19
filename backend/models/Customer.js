const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import Sequelize instance

const Customer = sequelize.define('Customer', {
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
  profilePicture: {
    type: DataTypes.STRING, // Assuming it's a URL string
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'Customer',
  timestamps: true,
  createdAt: 'created_at',  // Mapping Sequelize's createdAt to database's 'created_at'
  updatedAt: 'updated_at',  // Mapping Sequelize's updatedAt to database's 'updated_at'
});

module.exports = Customer;

