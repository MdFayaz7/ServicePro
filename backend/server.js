import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import dotenv from 'dotenv';
import path from "path";


import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import providerRoutes from './routes/providers.js';

dotenv.config();

const app = express();

// Simple CORS configuration
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Debug logs to verify each imported router
console.log('authRoutes:', authRoutes);
console.log('serviceRoutes:', serviceRoutes);
console.log('providerRoutes:', providerRoutes);

// Safety checks before mounting routes
if (typeof authRoutes === 'function') {
  app.use('/api/auth', authRoutes);
} else {
  console.error('authRoutes is not a router function');
}

if (typeof serviceRoutes === 'function') {
  app.use('/api/services', serviceRoutes);
} else {
  console.error('serviceRoutes is not a router function');
}

if (typeof providerRoutes === 'function') {
  app.use('/api/providers', providerRoutes);
} else {
  console.error('providerRoutes is not a router function');
}

//my code
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("/*", (req, res) => {
res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

//my code



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
