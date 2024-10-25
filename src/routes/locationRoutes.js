const express = require('express');
const locationController = require('../controllers/locationController');
const router = express.Router();

router.post('/locations', locationController.createLocation);
router.get('/locations', locationController.getLocations);
router.get('/locations/:id', locationController.getLocation);
router.put('/locations/:id', locationController.updateLocation);
router.delete('/locations/:id', locationController.deleteLocation);

module.exports = router;
