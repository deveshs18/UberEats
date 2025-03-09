const sequelize = require('../config/sequelize');
const Customer = require('./Customer');
const Restaurant = require('./Restaurant');
const Dish = require('./Dish');
const Favorite = require('./Favorite');

const models = {
  Customer,
  Restaurant,
  Dish,
  Favorite
};

// Initialize associations
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
}; 