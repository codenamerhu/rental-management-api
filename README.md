# Property Management API

This is a Node.js REST API for managing properties, locations, and user roles (Tenants, Landlords, Agents, and Staff). The API allows CRUD operations for properties and locations and includes features such as user authentication, role-based access control, image uploads to AWS S3, and more. The project follows best practices in structure, architecture, and testing.

## Table of Contents
- [Property Management API](#property-management-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Endpoints](#endpoints)
    - [Auth Endpoints](#auth-endpoints)
    - [Property Endpoints](#property-endpoints)
    - [Location Endpoints](#location-endpoints)
    - [Role-Based Access Control](#role-based-access-control)
  - [Testing](#testing)
  - [Future Improvements](#future-improvements)

## Features
- **User Authentication**: Register and login for users with roles (Tenant, Landlord, Agent, and Staff).
- **Role-Based Access Control**: Restrict access based on user roles and staff permissions (SuperUser, Editor, etc.).
- **Property and Location Management**: CRUD operations for properties and locations with fields like title, description, price, images, and location details (province, city, suburb, coordinates).
- **Image Upload**: Upload and store property images on AWS S3.
- **Forgot Password and OTP Verification**: Reset password functionality with email OTP verification.
- **Automated Testing**: Unit tests for controllers to ensure code reliability.

## Technologies Used
- **Node.js** & **Express**: Backend framework.
- **MongoDB** with **Mongoose**: Database and ODM for schema management.
- **JWT**: JSON Web Tokens for authentication.
- **AWS S3**: Storage for property images.
- **Jest**: Testing framework for unit tests.
- **dotenv**: Environment variable management.

## Getting Started

### Prerequisites
- Node.js >= 14
- MongoDB
- AWS S3 account for image uploads

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/codenamerhu/property-management-api.git
   cd property-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

### Project Structure
```
.
├── src
│   ├── controllers      # Controllers for handling requests
│   ├── models           # Mongoose models for MongoDB
│   ├── routes           # Route definitions
│   ├── middleware       # Authentication and role verification middleware
│   ├── services         # AWS S3 upload and other services
│   └── tests            # Unit tests for controllers
└── README.md
```

## Environment Variables

To run this project, you need to set up the following environment variables in a `.env` file at the root:

- **General Configuration**
  ```
  PORT=3000
  MONGODB_URI=your-mongodb-uri
  JWT_SECRET=your-jwt-secret
  ```

- **AWS Configuration**
  ```
  AWS_ACCESS_KEY_ID=your-aws-access-key-id
  AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
  S3_BUCKET_NAME=your-s3-bucket-name
  ```

## Endpoints

### Auth Endpoints
- **POST** `/auth/register` - Register a user with role (Tenant, Landlord, Agent, Staff).
- **POST** `/auth/login` - Login and receive a JWT token.
- **POST** `/auth/forgot-password` - Send OTP for password reset.
- **POST** `/auth/reset-password` - Reset password using OTP.

### Property Endpoints
- **POST** `/properties` - Create a property (Landlords/Agents only).
- **GET** `/properties` - Get all properties.
- **GET** `/properties/:id` - Get a single property by ID.
- **PUT** `/properties/:id` - Update a property by ID (requires ownership).
- **DELETE** `/properties/:id` - Delete a property by ID (requires ownership).

### Location Endpoints
- **POST** `/locations` - Create a new location.
- **GET** `/locations` - Get all locations.
- **GET** `/locations/:id` - Get a single location by ID.
- **PUT** `/locations/:id` - Update a location.
- **DELETE** `/locations/:id` - Delete a location.

### Role-Based Access Control
- **SuperUser**: Full access to all features.
- **Editor**: Limited access to certain CRUD operations.

## Testing
This project uses Jest for testing. You can run tests with:

```bash
npm test
```

Tests include:
- Authentication tests (registration, login, role validation).
- Property tests (create, read, update, delete).
- Location tests (CRUD operations).

## Future Improvements
- Add support for advanced search and filtering on properties.
- Implement pagination for property and location listings.
- Improve role-based access control with custom permissions.
- Add more unit and integration tests.

---

This project is designed to follow best practices in architecture, security, and testability. Contributions are welcome!