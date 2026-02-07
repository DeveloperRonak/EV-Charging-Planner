require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:passw0rd123@cluster0.xu2papp.mongodb.net/ev-charger?appName=Cluster0', {
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
    { name: "Indian Fuel (Mumbai Central)", address: "Opposite City Mall, Mumbai", latitude: 19.0860, longitude: 72.8877, chargerType: "Fast Charge", availability: true, price: 18 },
    { name: "Indian Fuel (Thane Hub)", address: "LBS Marg, Thane West", latitude: 19.2283, longitude: 72.9881, chargerType: "Fast Charge", availability: true, price: 15 },
    { name: "Indian Fuel (Highway Stop)", address: "NH-48 Express Way", latitude: 20.0000, longitude: 72.9000, chargerType: "Super Charger", availability: true, price: 20 },
    { name: "Indian Fuel (Surat Entry)", address: "Ring Road, Surat", latitude: 21.1600, longitude: 72.8200, chargerType: "Slow Charge", availability: true, price: 12 },
    { name: "Indian Fuel (Delhi Gate)", address: "Connaught Place, Delhi", latitude: 28.7141, longitude: 77.1125, chargerType: "Fast Charge", availability: true, price: 18 }
  ]);

  console.log('Database setup complete!');
  process.exit(0);
}

setup().catch(console.error);
