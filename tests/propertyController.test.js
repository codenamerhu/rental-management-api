const propertyController = require('../src/controllers/propertyController');
const Property = require('../src/models/Property');
const Location = require('../src/models/Location');
const { PropertyTypes, TransactionTypes } = require('../src/constants/propertyTypes');
jest.mock('../src/models/Property'); // Mock the Property model
jest.mock('../src/models/Location');

describe('Property API', () => {
    it('should create a property with a valid location', async () => {
        const req = {
            body: {
                title: 'Beautiful Apartment',
                description: 'A great apartment in the city center',
                propertyType: 'Apartment',
                transactionType: 'Rent',
                price: 1200,
                locationId: 'some-location-id'
            },
            files: [{ location: 'https://s3-bucket/image1.jpg' }],
            user: { _id: 'some-user-id' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        const location = {
            _id: 'some-location-id',
            province: 'Gauteng',
            city: 'Johannesburg',
            suburb: 'Sandton',
            coordinates: '-26.1076, 28.0567'
        };
    
        const createdProperty = {
            _id: 'some-property-id',
            title: 'Beautiful Apartment',
            description: 'A great apartment in the city center',
            propertyType: 'Apartment',
            transactionType: 'Rent',
            price: 1200,
            location: location._id,
            images: ['https://s3-bucket/image1.jpg'],
            owner: 'some-user-id'
        };
    
        // Mock Location.findById to return the location
        Location.findById = jest.fn().mockResolvedValue(location);
    
        // Mock the property instance and save method
        const mockPropertyInstance = {
            save: jest.fn().mockResolvedValue(createdProperty)
        };
    
        // Mock Property constructor to return the mocked instance
        Property.mockImplementation(() => mockPropertyInstance);
    
        await propertyController.createProperty(req, res);
    
        // Assert that the property was saved and the correct response was sent
        expect(mockPropertyInstance.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ property: createdProperty });
    });
    
    

    it('should return 400 if propertyType is missing or invalid', async () => {
        const req = {
            body: {
                title: 'Beautiful Apartment',
                description: 'A great apartment in the city center',
                transactionType: TransactionTypes.RENT,
                price: 1200,
                location: { address: '123 Main St', coordinates: [40.7128, -74.0060] }
            },
            files: [{ location: 'https://s3-bucket/image1.jpg' }],
            user: { _id: 'some-user-id' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await propertyController.createProperty(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid property type' });
    });

    it('should return 400 if transactionType is missing or invalid', async () => {
        const req = {
            body: {
                title: 'Beautiful Apartment',
                description: 'A great apartment in the city center',
                propertyType: PropertyTypes.APARTMENT,
                price: 1200,
                location: { address: '123 Main St', coordinates: [40.7128, -74.0060] }
            },
            files: [{ location: 'https://s3-bucket/image1.jpg' }],
            user: { _id: 'some-user-id' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await propertyController.createProperty(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid transaction type' });
    });

    it('should return 400 if no images are provided', async () => {
        const req = {
            body: {
                title: 'Beautiful Apartment',
                description: 'A great apartment in the city center',
                propertyType: PropertyTypes.APARTMENT,
                transactionType: TransactionTypes.RENT,
                price: 1200,
                location: { address: '123 Main St', coordinates: [40.7128, -74.0060] }
            },
            files: [],
            user: { _id: 'some-user-id' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await propertyController.createProperty(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'At least one image is required' });
    });

    it('should update a property with valid input', async () => {
        const req = {
            params: { id: 'some-property-id' },
            body: {
                title: 'Updated Title',
                description: 'Updated Description',
                price: 1500,
                locationId: 'some-location-id'
            },
            files: [{ location: 'https://s3-bucket/new-image.jpg' }],
            user: { _id: 'some-user-id' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        const location = {
            _id: 'some-location-id',
            province: 'Gauteng',
            city: 'Johannesburg',
            suburb: 'Sandton',
            coordinates: '-26.1076, 28.0567'
        };
    
        // Define the existing property with a proper save mock
        const existingProperty = {
            _id: 'some-property-id',
            title: 'Old Title',
            description: 'Old Description',
            propertyType: 'Apartment',
            transactionType: 'Rent',
            price: 1200,
            location: location._id,
            images: ['https://s3-bucket/image1.jpg'],
            owner: 'some-user-id',
            save: jest.fn().mockResolvedValue({ // Mock save method to return updated property
                _id: 'some-property-id',
                title: 'Updated Title',
                description: 'Updated Description',
                propertyType: 'Apartment',
                transactionType: 'Rent',
                price: 1500,
                location: 'some-location-id',
                images: ['https://s3-bucket/new-image.jpg'],
                owner: 'some-user-id'
            })
        };
    
        // Mock Location.findById to return the location
        Location.findById = jest.fn().mockResolvedValue(location);
    
        // Mock Property.findById to return the existing property
        Property.findById.mockResolvedValue(existingProperty);
    
        await propertyController.updateProperty(req, res);
    
        // Check that the property is updated as expected
        expect(existingProperty.title).toBe('Updated Title');
        expect(existingProperty.description).toBe('Updated Description');
        expect(existingProperty.price).toBe(1500);
        expect(existingProperty.images).toEqual(['https://s3-bucket/new-image.jpg']);
        
        // Assert that res.status was called with 200 (OK)
        expect(res.status).toHaveBeenCalledWith(200);
        
        // Assert that res.json was called with the updated property
        expect(res.json).toHaveBeenCalledWith({
            property: {
                _id: 'some-property-id',
                title: 'Updated Title',
                description: 'Updated Description',
                propertyType: 'Apartment',
                transactionType: 'Rent',
                price: 1500,
                location: 'some-location-id',
                images: ['https://s3-bucket/new-image.jpg'],
                owner: 'some-user-id'
            }
        });
    });    
    
    it('should delete a property if it exists', async () => {
        const req = { params: { id: 'some-property-id' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        const property = {
            _id: 'some-property-id',
            title: 'Beautiful Apartment',
            description: 'A great apartment in the city center',
            owner: 'some-user-id',
            remove: jest.fn().mockResolvedValue(true) // Mock remove method
        };
    
        Property.findById.mockResolvedValue(property);
    
        await propertyController.deleteProperty(req, res);
    
        expect(property.remove).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Property deleted successfully' });
    });

    it('should retrieve a property by id', async () => {
        const req = { params: { id: 'some-property-id' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        const property = {
            _id: 'some-property-id',
            title: 'Beautiful Apartment',
            description: 'A great apartment in the city center',
            propertyType: PropertyTypes.APARTMENT,
            transactionType: TransactionTypes.BUY,
            price: 1200,
            location: { address: '123 Main St', coordinates: [40.7128, -74.0060] },
            images: ['https://s3-bucket/image1.jpg'],
            owner: 'some-user-id'
        };
    
        // Mock the findById() query chain
        const mockFindById = {
            populate: jest.fn().mockResolvedValue(property)  // Mock populate
        };
    
        // Mock Property.findById to return the query chain
        Property.findById.mockReturnValue(mockFindById);
    
        await propertyController.getProperty(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ property });
    });
       

    it('should retrieve all properties', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        const properties = [
            {
                _id: 'some-property-id-1',
                title: 'Beautiful Apartment',
                propertyType: PropertyTypes.APARTMENT,
                transactionType: TransactionTypes.BUY,
                price: 1200,
                location: { address: '123 Main St', coordinates: [40.7128, -74.0060] },
                images: ['https://s3-bucket/image1.jpg'],
                owner: 'some-user-id'
            },
            {
                _id: 'some-property-id-2',
                title: 'Luxury House',
                propertyType: PropertyTypes.HOUSE,
                transactionType: TransactionTypes.RENT,
                price: 2500,
                location: { address: '456 Park Ave', coordinates: [40.7812, -73.9665] },
                images: ['https://s3-bucket/image2.jpg'],
                owner: 'another-user-id'
            }
        ];
    
        // Mock the find() query chain with populate
        const mockFind = {
            populate: jest.fn().mockResolvedValue(properties)  // Mock populate
        };
    
        // Mock Property.find to return the query chain
        Property.find.mockReturnValue(mockFind);
    
        await propertyController.getProperties(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ properties });
    });     
    
    // More tests for get, update, and delete operations
});
