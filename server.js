const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ev-charger', {
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String
});
const User = mongoose.model('User', userSchema);

// Charging Station Schema
const stationSchema = new mongoose.Schema({
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  chargerType: String,
  availability: Boolean,
  price: Number
});
const Station = mongoose.model('Station', stationSchema);

// Trip Schema
const tripSchema = new mongoose.Schema({
  userId: String,
  startLocation: String,
  endLocation: String,
  stations: Array,
  createdAt: { type: Date, default: Date.now }
});
const Trip = mongoose.model('Trip', tripSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');
  
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = decoded;
    next();
  } catch {
    res.status(400).send('Invalid token');
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'secret123');
    res.json({ token, user: { id: user._id, email, name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret123');
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

app.get('/api/stations', async (req, res) => {
  const stations = await Station.find();
  res.json(stations);
});

app.post('/api/trips', auth, async (req, res) => {
  try {
    const trip = new Trip({ ...req.body, userId: req.user.userId });
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: 'Trip creation failed' });
  }
});

app.get('/api/trips', auth, async (req, res) => {
  const trips = await Trip.find({ userId: req.user.userId });
  res.json(trips);
});

// Sample data
app.post('/api/seed', async (req, res) => {
  await Station.deleteMany({});
  const stations = [
    { name: "Tesla Supercharger", address: "123 Main St", latitude: 40.7128, longitude: -74.0060, chargerType: "Supercharger", availability: true, price: 0.28 },
    { name: "ChargePoint", address: "456 Oak Ave", latitude: 40.7589, longitude: -73.9851, chargerType: "Level 2", availability: true, price: 0.15 },
    { name: "EVgo", address: "789 Pine Rd", latitude: 40.7505, longitude: -73.9934, chargerType: "DC Fast", availability: false, price: 0.25 }
  ];
  await Station.insertMany(stations);
  res.json({ message: 'Sample data added' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
