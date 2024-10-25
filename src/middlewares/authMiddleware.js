const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const { Roles, StaffRoles } = require('../constants/roles');

// General authentication middleware
exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded; // decoded includes roles and staffRole if applicable
        next();
    });
};

// Role-based access control with staff role handling
exports.roleMiddleware = (roles, staffRoles = []) => (req, res, next) => {
    const userRoles = req.user.roles;
    const userStaffRole = req.user.staffRole;

    // Check if the user has any of the required roles
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    // If the user is Staff, check for specific staff roles
    const hasRequiredStaffRole = userRoles.includes(Roles.STAFF) 
        ? staffRoles.includes(userStaffRole)
        : true;

    if (!hasRequiredRole || !hasRequiredStaffRole) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};
