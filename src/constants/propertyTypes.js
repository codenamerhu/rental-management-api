// Enum for Property Types
const PropertyTypes = Object.freeze({
    HOUSE: 'House',
    APARTMENT: 'Apartment',
    VACANT_LAND: 'Vacant Land',
    COMMERCIAL: 'Commercial' // Add more as needed
});

// Enum for Transaction Types (Buy or Rent)
const TransactionTypes = Object.freeze({
    BUY: 'Buy',
    RENT: 'Rent'
});

module.exports = { PropertyTypes, TransactionTypes };