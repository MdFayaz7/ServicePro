import express from 'express';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import * as authMiddleware from '../middleware/auth.js';

const { verifyToken } = authMiddleware;

const router = express.Router();

// Create or Update provider data (mechanic)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user } = req;
    const data = { ...req.body, userId: user.id };

    let provider = await Provider.findOne({ userId: user.id });
    if (provider) {
      Object.assign(provider, data);
    } else {
      provider = new Provider(data);
    }
    await provider.save();
    res.json(provider);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get providers by service id
router.get('/by-service/:id', async (req, res) => {
  try {
    const providers = await Provider.find({ serviceType: req.params.id, status: 'approved' }).populate('serviceType').exec();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Nearby providers using Haversine formula for 40km radius
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, serviceType, radius = 40 } = req.query;
    if (!lat || !lng) return res.status(400).json({ msg: "Missing lat or lng" });

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    // Build query - include both pending and approved for now
    let query = { status: { $in: ['pending', 'approved'] } };
    if (serviceType) {
      query.serviceType = serviceType;
    }

    // Get all providers first (for demo - in production use MongoDB geo queries)
    const allProviders = await Provider.find(query).populate('userId', 'name email').exec();
    
    // Filter by distance using Haversine formula
    const nearbyProviders = allProviders.filter(provider => {
      const distance = calculateDistance(userLat, userLng, provider.latitude, provider.longitude);
      return distance <= searchRadius;
    });

    // Sort by distance
    nearbyProviders.sort((a, b) => {
      const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
      const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
      return distA - distB;
    });

    // Get services for each provider
    const providersWithServices = await Promise.all(
      nearbyProviders.map(async (provider) => {
        const services = await Service.find({ 
          providerId: provider.userId._id,
          status: 'active'
        }).exec();
        
        return {
          ...provider.toObject(),
          services: services
        };
      })
    );

    res.json(providersWithServices);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get provider's own profile
router.get('/my-profile', verifyToken, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.id });
    if (!provider) {
      return res.status(404).json({ msg: 'Provider profile not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;
