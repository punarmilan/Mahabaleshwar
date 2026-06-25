const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Look in root
require('dotenv').config(); // Fallback to local .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/property'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/booking'));

// DB Connection
console.log('Using MongoDB URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');
console.log('Using JWT Secret:', process.env.JWT_SECRET ? 'FOUND' : 'MISSING');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('DB Connection Error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
