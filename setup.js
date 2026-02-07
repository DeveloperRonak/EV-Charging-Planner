const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/ev-charger', {
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String
});
const User = mongoose.model('User', userSchema);

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

async function setup() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.deleteMany({});
  await User.create({
    email: 'admin@ev.com',
    password: hashedPassword,
    name: 'Admin User'
  });

  // Add sample charging stations
  await Station.deleteMany({});
  await Station.insertMany([
    { name: "Tesla Supercharger NYC", address: "123 Broadway, New York, NY", latitude: 40.7128, longitude: -74.0060, chargerType: "Supercharger", availability: true, price: 0.28 },
    { name: "ChargePoint Station", address: "456 5th Ave, New York, NY", latitude: 40.7589, longitude: -73.9851, chargerType: "Level 2", availability: true, price: 0.15 },
    { name: "EVgo Fast Charger", address: "789 Park Ave, New York, NY", latitude: 40.7505, longitude: -73.9934, chargerType: "DC Fast", availability: false, price: 0.25 },
    { name: "Electrify America", address: "321 Lexington Ave, New York, NY", latitude: 40.7505, longitude: -73.9779, chargerType: "DC Fast", availability: true, price: 0.30 }
  ]);

  console.log('Database setup complete!');
  process.exit(0);
}

setup().catch(console.error);
