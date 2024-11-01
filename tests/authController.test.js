const { Roles, StaffRoles } = require('../src/constants/roles');
const authService = require('../src/services/authService');
const authController = require('../src/controllers/authController');

jest.mock('../src/services/authService'); // Mock the service

describe('Auth API', () => {
    it('should register a new Staff user with SuperUser role', async () => {
        const req = {
            body: {
                firstName: "Admin",
                lastName: "User",
                email: 'admin@example.com',
                password: 'password123',
                roles: [Roles.STAFF],
                staffRole: StaffRoles.SUPERUSER
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.register.mockResolvedValue('mocked-jwt-token');

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });

    it('should deny login if role is missing or incorrect', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                role: Roles.AGENT
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.login.mockRejectedValue(new Error('Access denied: Unauthorized role'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied: Unauthorized role' });
    });

    it('should deny login if staffRole is incorrect', async () => {
        const req = {
            body: {
                email: 'staff@example.com',
                password: 'password123',
                role: Roles.STAFF,
                staffRole: StaffRoles.EDITOR
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.login.mockRejectedValue(new Error('Access denied: Unauthorized staff role'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied: Unauthorized staff role' });
    });

    // Additional Tests for Agent, Tenant, and Landlord roles

    it('should register a new Agent user', async () => {
        const req = {
            body: {
                name: 'Agent User',
                email: 'agent@example.com',
                password: 'password123',
                roles: [Roles.AGENT]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.register.mockResolvedValue('mocked-jwt-token');

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });

    it('should login a valid Agent user', async () => {
        const req = {
            body: {
                email: 'agent@example.com',
                password: 'password123',
                role: Roles.AGENT
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.login.mockResolvedValue('mocked-jwt-token');

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });

    it('should register a new Tenant user', async () => {
        const req = {
            body: {
                name: 'Tenant User',
                email: 'tenant@example.com',
                password: 'password123',
                roles: [Roles.TENANT]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.register.mockResolvedValue('mocked-jwt-token');

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });

    it('should login a valid Tenant user', async () => {
        const req = {
            body: {
                email: 'tenant@example.com',
                password: 'password123',
                role: Roles.TENANT
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.login.mockResolvedValue('mocked-jwt-token');

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });

    it('should register a new Landlord user', async () => {
        const req = {
            body: {
                name: 'Landlord User',
                email: 'landlord@example.com',
                password: 'password123',
                roles: [Roles.LANDLORD]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.register.mockResolvedValue('mocked-jwt-token');

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });

    it('should login a valid Landlord user', async () => {
        const req = {
            body: {
                email: 'landlord@example.com',
                password: 'password123',
                role: Roles.LANDLORD
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        authService.login.mockResolvedValue('mocked-jwt-token');

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'mocked-jwt-token' });
    });
});

describe('Forgot Password API', () => {
    it('should send OTP to a registered email', async () => {
        const req = { body: { email: 'user@example.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        authService.requestPasswordReset.mockResolvedValue();

        await authController.requestPasswordReset(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'OTP sent to email' });
    });

    it('should verify a correct OTP', async () => {
        const req = { body: { email: 'user@example.com', otp: '123456' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        authService.verifyOtp.mockResolvedValue();

        await authController.verifyOtp(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'OTP verified' });
    });

    it('should change the password for a verified OTP', async () => {
        const req = { body: { email: 'user@example.com', newPassword: 'newPassword123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        authService.changePassword.mockResolvedValue();

        await authController.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });
});

