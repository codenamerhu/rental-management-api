const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

exports.generateToken = (user) => {
    if (!secret) throw new Error('JWT secret is not set');
    return jwt.sign(
        { id: user._id, roles: user.roles, staffRole: user.staffRole }, 
        secret, 
        { expiresIn: '1h' }
    );
};
