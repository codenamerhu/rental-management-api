const locationController = require('../src/controllers/locationController');
const Location = require('../src/models/Location');
jest.mock('../src/models/Location');

describe('Location API', () => {
    it('should create a location', async () => {
        const req = {
            body: {
                province: 'Gauteng',
                city: 'Johannesburg',
                suburb: 'Sandton',
                coordinates: '-26.1076, 28.0567'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const location = {
            province: 'Gauteng',
            city: 'Johannesburg',
            suburb: 'Sandton',
            coordinates: '-26.1076, 28.0567',
            save: jest.fn().mockResolvedValue(true) // Mock save method
        };

        // Mock the Location constructor and save method
        Location.mockImplementation(() => location);

        await locationController.createLocation(req, res);

        expect(location.save).toHaveBeenCalled(); // Ensure save is called
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ location });
    });

    it('should retrieve all locations', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const locations = [
            {
                province: 'Gauteng',
                city: 'Johannesburg',
                suburb: 'Sandton',
                coordinates: '-26.1076, 28.0567'
            }
        ];

        Location.find.mockResolvedValue(locations);

        await locationController.getLocations(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ locations });
    });
});