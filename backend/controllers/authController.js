const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');

// Signup a new customer
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = await Customer.create({
        name,
        email,
        password: hashedPassword,
        profilePicture: '', // Default empty string
        country: '',        // Default empty string
        state: '',          // Default empty string
      });
      

    // Respond with the newly created user
    res.status(201).json({
      message: 'User registered successfully',
      customer: { id: newCustomer.id, name: newCustomer.name, email: newCustomer.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a customer
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Respond with success message
    res.status(200).json({
      message: 'Login successful',
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
};
