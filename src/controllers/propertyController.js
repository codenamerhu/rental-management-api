const Property = require('../models/Property');
const { PropertyTypes, TransactionTypes} = require('../constants/propertyTypes');
const { upload } = require('../services/s3Service');
const Location = require('../models/Location');

// Create a property
exports.createProperty = async (req, res) => {
    try {
        const { title, description, propertyType, transactionType, price, locationId } = req.body;

        // Validate property type and transaction type
        if (!Object.values(PropertyTypes).includes(propertyType)) {
            return res.status(400).json({ error: 'Invalid property type' });
        }

        if (!Object.values(TransactionTypes).includes(transactionType)) {
            return res.status(400).json({ error: 'Invalid transaction type' });
        }

        // Validate and fetch the location
        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Ensure there are images uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        const imageUrls = req.files.map(file => file.location); // Extract S3 image URLs

        const property = new Property({
            title,
            description,
            propertyType,
            transactionType,
            price,
            location: location._id, // Link location to property
            images: imageUrls,
            owner: req.user._id
        });

        const createdProperty = await property.save();

        // Correctly pass the created property to res.json
        res.status(201).json({ property: createdProperty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update a property
exports.updateProperty = async (req, res) => {
    try {
        const { title, description, propertyType, transactionType, price, locationId } = req.body;

        // Find the property by ID
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // If locationId is provided, find and update the location reference
        if (locationId) {
            const location = await Location.findById(locationId);
            if (!location) {
                return res.status(404).json({ error: 'Location not found' });
            }
            property.location = location._id; // Update the location field in the property
        }

        // Update property fields if provided
        if (title) property.title = title;
        if (description) property.description = description;
        if (propertyType) property.propertyType = propertyType;
        if (transactionType) property.transactionType = transactionType;
        if (price) property.price = price;

        // If images are provided, update them (assuming the images are stored on AWS S3)
        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.location); // Extract S3 URLs from the uploaded files
            property.images = imageUrls;
        }

        // Save the updated property
        const updatedProperty = await property.save();

        // Send the updated property in the response
        res.status(200).json({ property: updatedProperty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner');
        res.status(200).json({ properties });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner');
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.status(200).json({ property });
    } catch (error) {
        console.log('Error in getProperty:', error.message);  // Log the actual error
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        await property.remove();
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
