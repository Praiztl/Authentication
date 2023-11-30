const request = require('supertest');
const server = require('../src/index'); // Import the server
const { expect } = require('chai');

describe('Authentication Flow', () => {
  it('should register a new user', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({
        username: 'testuser',//change this to something else before you run test
        email: 'testuser@example.com',//change this to something else before you run test
        password: 'testpassword'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Registration successful');
  });
  it('should login with valid credentials', async () => {
    // Similar test for login
  });

  it('should access user profile with a valid token', async () => {
    // Similar test for accessing the user profile
  });
});
