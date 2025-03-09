const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const { Op } = require('sequelize');

const getTimeRange = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'day':
      return new Date(now.setDate(now.getDate() - 1));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 7));
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const restaurantId = req.restaurant.id;
    const startDate = getTimeRange(timeRange);
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - 7);

    // Get current period orders
    const currentOrders = await Order.findAll({
      where: {
        restaurant_id: restaurantId,
        created_at: {
          [Op.gte]: startDate
        }
      },
      include: [
        {
          model: OrderItem,
          include: [Dish]
        }
      ]
    });

    // Get previous period orders for comparison
    const previousOrders = await Order.findAll({
      where: {
        restaurant_id: restaurantId,
        created_at: {
          [Op.gte]: previousStartDate,
          [Op.lt]: startDate
        }
      }
    });

    // Calculate metrics
    const totalRevenue = currentOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const revenueChange = previousRevenue ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const totalOrders = currentOrders.length;
    const previousOrdersCount = previousOrders.length;
    const ordersChange = previousOrdersCount ? ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100 : 0;

    // Get unique customers
    const currentCustomers = new Set(currentOrders.map(order => order.customer_id));
    const previousCustomers = new Set(previousOrders.map(order => order.customer_id));
    const newCustomers = [...currentCustomers].filter(id => !previousCustomers.has(id)).length;
    const customersChange = previousCustomers.size ? ((currentCustomers.size - previousCustomers.size) / previousCustomers.size) * 100 : 0;

    // Calculate average rating
    const ratings = currentOrders.map(order => order.rating).filter(rating => rating !== null);
    const averageRating = ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    const previousRatings = previousOrders.map(order => order.rating).filter(rating => rating !== null);
    const previousAverageRating = previousRatings.length ? previousRatings.reduce((sum, rating) => sum + rating, 0) / previousRatings.length : 0;
    const ratingChange = previousAverageRating ? averageRating - previousAverageRating : 0;

    // Get revenue data for chart
    const revenueData = await Order.findAll({
      where: {
        restaurant_id: restaurantId,
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'value']
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
    });

    // Get popular items
    const popularItems = await OrderItem.findAll({
      where: {
        order_id: {
          [Op.in]: currentOrders.map(order => order.id)
        }
      },
      attributes: [
        'dish_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('price')), 'revenue']
      ],
      include: [{
        model: Dish,
        attributes: ['name']
      }],
      group: ['dish_id', 'Dish.id', 'Dish.name'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 5
    });

    // Get order status distribution
    const orderStatus = await Order.findAll({
      where: {
        restaurant_id: restaurantId,
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    res.json({
      totalRevenue,
      revenueChange,
      totalOrders,
      ordersChange,
      newCustomers,
      customersChange,
      averageRating,
      ratingChange,
      revenueData,
      popularItems: popularItems.map(item => ({
        name: item.Dish.name,
        orders: parseInt(item.get('orders')),
        revenue: parseFloat(item.get('revenue'))
      })),
      orderStatus: orderStatus.map(status => ({
        name: status.status,
        count: parseInt(status.get('count'))
      })),
      maxRevenue: Math.max(...revenueData.map(data => parseFloat(data.get('value'))))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

module.exports = {
  getAnalytics
}; 