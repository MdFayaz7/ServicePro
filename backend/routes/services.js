import express from 'express';
import Service from '../models/Service.js';
import * as authMiddleware from '../middleware/auth.js';

const { verifyToken } = authMiddleware;
const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get provider's own services
router.get('/my-services', verifyToken, async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Create new service (provider only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      providerId: req.user.id
    };
    
    const service = new Service(serviceData);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Update service (provider only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      providerId: req.user.id 
    });
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Delete service (provider only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      providerId: req.user.id 
    });
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;