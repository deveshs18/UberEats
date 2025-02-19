const { hashPassword, comparePassword } = require('../utils/passwordHash');
const Customer = require('../models/Customer'); // Your Sequelize model

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user in the database
    await Customer.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing up' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Customer.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Store user information in session
    req.session.user = { id: user.id, email: user.email };
    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Error logging out' });
    res.json({ message: 'User logged out successfully' });
  });
};

// Check if a user is authenticated (middleware)
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    res.json({
      message: "User is authenticated",
      user: req.session.user,
    });
    next();
  } else {
    res.status(401).json({
      message: "User is not authenticated",
    });
  }
};
