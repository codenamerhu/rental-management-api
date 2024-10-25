const User = require('../models/User');
const jwt = require('../utils/jwt');
const { Roles, StaffRoles } = require('../constants/roles');
const Otp = require('../models/Otp');
const { generateOtp } = require('../utils/otp');
const { sendOtpEmail } = require('./emailService');
const bcrypt = require('bcryptjs');

exports.register = async (userData) => {
    const user = new User(userData);
    await user.save();
    return jwt.generateToken(user);
};

exports.login = async (email, password, role, staffRole = null) => {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
    }

    // Check if the user has the required role
    if (!user.roles.includes(role)) {
        throw new Error('Access denied: Unauthorized role');
    }

    // If the user is staff, check for specific staff role
    if (role === Roles.STAFF && staffRole && user.staffRole !== staffRole) {
        throw new Error('Access denied: Unauthorized staff role');
    }

    return jwt.generateToken(user);
};

exports.requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User with this email does not exist');
    }

    // Generate OTP and save it in the database
    const { otp, expiresAt } = generateOtp();
    await Otp.create({ email, otp, expiresAt });

    // Send OTP to the user's email
    await sendOtpEmail(email, otp);
};

exports.verifyOtp = async (email, otp) => {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
        throw new Error('Invalid or expired OTP');
    }

    otpRecord.verified = true;
    await otpRecord.save();
};

exports.changePassword = async (email, newPassword) => {
    const otpRecord = await Otp.findOne({ email, verified: true });
    if (!otpRecord) {
        throw new Error('OTP not verified or expired');
    }

    const user = await User.findOne({ email });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Invalidate OTP after password change
    await Otp.deleteMany({ email });
};