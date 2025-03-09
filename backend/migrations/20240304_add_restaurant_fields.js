const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurant', 'cuisine', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Restaurant', 'delivery_time', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Restaurant', 'rating', {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('Restaurant', 'price_range', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurant', 'cuisine');
    await queryInterface.removeColumn('Restaurant', 'delivery_time');
    await queryInterface.removeColumn('Restaurant', 'rating');
    await queryInterface.removeColumn('Restaurant', 'price_range');
  }
}; 