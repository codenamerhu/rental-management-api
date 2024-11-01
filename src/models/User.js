const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Roles, StaffRoles } = require('../constants/roles');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: String, required: true },
    roles: { 
        type: [String], 
        enum: Object.values(Roles), // Use enum for role validation
        default: [Roles.TENANT], 
        required: true 
    },
    staffRole: {
        type: String,
        enum: Object.values(StaffRoles), // Use enum for staff role validation
        default: null // This only applies if the user is in the "Staff" role
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
