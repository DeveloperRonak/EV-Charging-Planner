require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ev-charger';

mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB (${mongoURI.includes('127.0.0.1') ? 'Local' : 'Cloud'})`))
  .catch(err => console.error('MongoDB connection error:', err));

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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).send('Invalid token');
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
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
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
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
    { name: "Indian Fuel (Mumbai Central)", address: "Opposite City Mall, Mumbai", latitude: 19.0860, longitude: 72.8877, chargerType: "Fast Charge", availability: true, price: 18 },
    { name: "Indian Fuel (Thane Hub)", address: "LBS Marg, Thane West", latitude: 19.2283, longitude: 72.9881, chargerType: "Fast Charge", availability: true, price: 15 },
    { name: "Indian Fuel (Highway Stop)", address: "NH-48 Express Way", latitude: 20.0000, longitude: 72.9000, chargerType: "Super Charger", availability: true, price: 20 },
    { name: "Indian Fuel (Surat Entry)", address: "Ring Road, Surat", latitude: 21.1600, longitude: 72.8200, chargerType: "Slow Charge", availability: true, price: 12 },
    { name: "Indian Fuel (Delhi Gate)", address: "Connaught Place, Delhi", latitude: 28.7141, longitude: 77.1125, chargerType: "Fast Charge", availability: true, price: 18 }
  ];
  await Station.insertMany(stations);

  // Create Admin User if not exists
  const existingAdmin = await User.findOne({ email: 'admin@ev.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ email: 'admin@ev.com', password: hashedPassword, name: 'Admin User' });
  }

  res.json({ message: 'Database seeded with Stations and Admin User' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
