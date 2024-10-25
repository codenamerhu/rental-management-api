const express = require('express');
const propertyController = require('../controllers/propertyController');
const { upload } = require('../services/s3Service');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Assume authMiddleware handles user authentication

const router = express.Router();

router.post('/properties', authMiddleware, upload.array('images', 5), propertyController.createProperty);
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getProperty);
router.put('/properties/:id', authMiddleware, upload.array('images', 5), propertyController.updateProperty);
router.delete('/properties/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
