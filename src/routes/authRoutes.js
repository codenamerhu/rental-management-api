const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.requestPasswordReset); // Request OTP
router.post('/verify-otp', authController.verifyOtp); // Verify OTP
router.post('/reset-password', authController.changePassword); // Change password

module.exports = router;
