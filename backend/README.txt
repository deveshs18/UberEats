This directory contains all of our backend server code

Our backend structure is as follows:
/backend
  ├── server.js             # Main entry point
  ├── config/
  │   └── db.js          # MySQL connection setup
  ├── controllers/       # Business logic for each route
  │   ├── authController.js
  │   ├── customerController.js
  │   ├── restaurantController.js
  │   ├── dishController.js
  │   └── orderController.js
  ├── middlewares/       # Custom middlewares for validation and authentication
  │   ├── authMiddleware.js
  │   └── errorHandler.js
  ├── models/            # Sequelize models for database tables
  │   ├── Customer.js
  │   ├── Restaurant.js
  │   ├── Dish.js
  │   ├── Order.js
  │   └── Favorite.js
  ├── routes/            # API routes
  │   ├── authRoutes.js
  │   ├── customerRoutes.js
  │   ├── restaurantRoutes.js
  │   ├── dishRoutes.js
  │   └── orderRoutes.js
  ├── utils/             # Utility functions like hashing and validation
  │   └── passwordHash.js

Database Schema:

Customer Table:
+----------------+--------------+-------------------------------+
| Column         | Type         | Description                   |
+----------------+--------------+-------------------------------+
| id             | INT          | Primary Key                   |
| name           | VARCHAR(255) | Customer's full name         |
| email          | VARCHAR(255) | Unique email address         |
| password       | VARCHAR(255) | Hashed password              |
| profilePicture | VARCHAR(255) | Profile image URL            |
| country        | VARCHAR(100) | Customer's country           |
| state          | VARCHAR(100) | Customer's state             |
| created_at     | TIMESTAMP    | Record creation timestamp    |
| updated_at     | TIMESTAMP    | Record update timestamp      |
+----------------+--------------+-------------------------------+

Restaurant Table:
+----------------+--------------+-------------------------------+
| Column         | Type         | Description                   |
+----------------+--------------+-------------------------------+
| id             | INT          | Primary Key                   |
| name           | VARCHAR(255) | Restaurant name              |
| email          | VARCHAR(255) | Unique email address         |
| password       | VARCHAR(255) | Hashed password              |
| description    | TEXT         | Restaurant description       |
| location       | VARCHAR(255) | Physical address             |
| contact_info   | VARCHAR(255) | Contact details              |
| timings        | JSON         | Operating hours              |
| profilePicture | VARCHAR(255) | Profile image URL            |
| created_at     | TIMESTAMP    | Record creation timestamp    |
| updated_at     | TIMESTAMP    | Record update timestamp      |
+----------------+--------------+-------------------------------+

Dish Table:
+-------------+--------------+-------------------------------+
| Column      | Type         | Description                   |
+-------------+--------------+-------------------------------+
| id          | INT          | Primary Key                   |
| name        | VARCHAR(255) | Dish name                    |
| ingredients | TEXT         | List of ingredients          |
| price       | DECIMAL      | Dish price                   |
| description | TEXT         | Dish description             |
| image       | VARCHAR(255) | Dish image URL               |
| category    | ENUM         | Appetizer, Main Course, etc. |
| restaurant_id| INT         | Foreign Key to Restaurant    |
+-------------+--------------+-------------------------------+

Order Table:
+---------------+--------------+-------------------------------+
| Column        | Type         | Description                   |
+---------------+--------------+-------------------------------+
| id            | INT          | Primary Key                   |
| customer_id   | INT          | Foreign Key to Customer      |
| restaurant_id | INT          | Foreign Key to Restaurant    |
| status        | ENUM         | New, Delivered, Cancelled    |
| items         | JSON         | Dish IDs and quantities      |
| total_price   | DECIMAL      | Total order amount          |
| created_at    | TIMESTAMP    | Record creation timestamp    |
| updated_at    | TIMESTAMP    | Record update timestamp      |
+---------------+--------------+-------------------------------+

Favorite Table:
+---------------+--------------+-------------------------------+
| Column        | Type         | Description                   |
+---------------+--------------+-------------------------------+
| id            | INT          | Primary Key                   |
| customer_id   | INT          | Foreign Key to Customer      |
| restaurant_id | INT          | Foreign Key to Restaurant    |
+---------------+--------------+-------------------------------+