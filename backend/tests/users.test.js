const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

describe('Users API', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management-test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      email: 'admin@example.com',
      password: 'Admin123456',
      fullName: 'Admin User',
      role: 'admin',
      status: 'active'
    });
    adminToken = generateToken(adminUser._id);

    // Create regular user
    regularUser = await User.create({
      email: 'user@example.com',
      password: 'User123456',
      fullName: 'Regular User',
      role: 'user',
      status: 'active'
    });
    userToken = generateToken(regularUser._id);
  });

  describe('GET /api/users', () => {
    it('should get all users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should reject access for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should reject access without token', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/users/:id/activate', () => {
    it('should activate user account (admin only)', async () => {
      // Create inactive user
      const inactiveUser = await User.create({
        email: 'inactive@example.com',
        password: 'Test123456',
        fullName: 'Inactive User',
        status: 'inactive'
      });

      const response = await request(app)
        .patch(`/api/users/${inactiveUser._id}/activate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.status).toBe('active');
    });

    it('should reject activation by non-admin', async () => {
      const inactiveUser = await User.create({
        email: 'inactive@example.com',
        password: 'Test123456',
        fullName: 'Inactive User',
        status: 'inactive'
      });

      const response = await request(app)
        .patch(`/api/users/${inactiveUser._id}/activate`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('user@example.com');
    });
  });

  describe('PATCH /api/users/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          fullName: 'Updated Name',
          email: 'updated@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.fullName).toBe('Updated Name');
      expect(response.body.data.user.email).toBe('updated@example.com');
    });
  });

  describe('PATCH /api/users/profile/password', () => {
    it('should change password successfully', async () => {
      const response = await request(app)
        .patch('/api/users/profile/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'User123456',
          newPassword: 'NewPassword123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify new password works
      const user = await User.findById(regularUser._id);
      const isValid = await user.comparePassword('NewPassword123');
      expect(isValid).toBe(true);
    });

    it('should reject password change with wrong current password', async () => {
      const response = await request(app)
        .patch('/api/users/profile/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

