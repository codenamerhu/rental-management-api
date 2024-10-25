const Location = require('../models/Location');

exports.createLocation = async (req, res) => {
    try {
        const { province, city, suburb, coordinates } = req.body;
        const location = new Location({ province, city, suburb, coordinates });
        await location.save(); // If you are using .save()
        res.status(201).json({ location });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json({ locations });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.status(200).json({ location });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { province, city, suburb, coordinates } = req.body;
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        location.province = province || location.province;
        location.city = city || location.city;
        location.suburb = suburb || location.suburb;
        location.coordinates = coordinates || location.coordinates;
        await location.save();
        res.status(200).json({ location });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        await location.remove();
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
