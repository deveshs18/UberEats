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
  }, {
    tableName: 'Customer',
    timestamps: true, // Keep Sequelize timestamps enabled
    createdAt: 'created_at',  // Map to the database field
    updatedAt: 'updated_at',  // Map to the database field
  });
  
module.exports = Customer;

