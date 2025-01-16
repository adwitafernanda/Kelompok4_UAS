process.env.NODE_ENV = 'test';
const request = require('supertest');
const path = require('path');
const app = require('../app');
const User = require('../models/User');

describe('POST /users/register', () => {
  it('should create a new user', async () => {
    const newUser = {
      username: 'acu',
      email: 'tchochote@gmail.com',
      password: 'admin'
    };

    const response = await request(app)
      .post('/users/register')
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User successfully added!');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('username', 'acu');
    expect(response.body.user).toHaveProperty('email', 'tchochote@gmail.com');
  });

});
