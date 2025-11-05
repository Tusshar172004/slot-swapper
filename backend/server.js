// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/slot-swapper';
connectDB(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo connect error:', err);
    process.exit(1);
  });

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/swap', require('./routes/swap'));

// health
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
