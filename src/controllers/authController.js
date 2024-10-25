const authService = require('../services/authService');
const authController = require('../controllers/authController');

exports.register = async (req, res) => {
    try {
        const token = await authService.register(req.body);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password, role, staffRole } = req.body; // Destructure req.body

    try {
        const token = await authService.login(email, password, role, staffRole);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        await authService.requestPasswordReset(email);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        await authService.verifyOtp(email, otp);
        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        await authService.changePassword(email, newPassword);
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};