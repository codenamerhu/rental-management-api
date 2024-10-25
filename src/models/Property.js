const mongoose = require('mongoose');
const { PropertyTypes, TransactionTypes } = require('../constants/propertyTypes');
const { Schema } = mongoose;

const propertySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyType: { 
        type: String, 
        enum: Object.values(PropertyTypes), 
        required: true 
    },
    transactionType: { 
        type: String, 
        enum: Object.values(TransactionTypes), 
        required: true 
    },
    price: { type: Number, required: true },
    location: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location',  // Reference to Location model
        required: true 
    },
    images: { type: [String], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);