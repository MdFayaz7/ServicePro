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

const allowedOrigins = [
  "https://service-pro-theta.vercel.app" // Vercel production
  // "http://localhost:3000" // Uncomment for local development if needed
];

// CORS middleware - top-level
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));
app.options('/*', cors());


// Logging middleware - separate
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Debug logs to verify imports
console.log('authRoutes:', authRoutes);
console.log('serviceRoutes:', serviceRoutes);
console.log('providerRoutes:', providerRoutes);

// Mount routes only if imported routers are functions
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

// Serve React build (uncomment and adjust if needed)
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.use((req, res, next) => {
//   if (req.path.startsWith("/api")) return next();
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
