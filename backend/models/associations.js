const Customer = require('./Customer');
const Restaurant = require('./Restaurant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Dish = require('./Dish');

function setupAssociations() {
    // Customer associations
    Customer.hasMany(Order, {
        foreignKey: 'customer_id',
        as: 'orders'
    });

    // Restaurant associations
    Restaurant.hasMany(Order, {
        foreignKey: 'restaurant_id',
        as: 'orders'
    });
    Restaurant.hasMany(Dish, {
        foreignKey: 'restaurant_id',
        as: 'dishes'
    });

    // Order associations
    Order.belongsTo(Customer, {
        foreignKey: 'customer_id',
        as: 'Customer'
    });
    Order.belongsTo(Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'Restaurant'
    });
    Order.hasMany(OrderItem, {
        foreignKey: 'order_id',
        as: 'orderItems'
    });

    // OrderItem associations
    OrderItem.belongsTo(Order, {
        foreignKey: 'order_id',
        as: 'order'
    });
    OrderItem.belongsTo(Dish, {
        foreignKey: 'dish_id',
        as: 'dish'
    });

    // Dish associations
    Dish.belongsTo(Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'restaurant'
    });
}

module.exports = setupAssociations; 