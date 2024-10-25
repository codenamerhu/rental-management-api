const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    province: { type: String, required: true },
    city: { type: String, required: true },
    suburb: { type: String, required: true },
    coordinates: { type: String, required: true } // Format: "latitude, longitude"
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
