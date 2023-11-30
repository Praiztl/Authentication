const request = require('supertest');
const app = require('../src/app'); // Import your Express app
const { expect } = require('chai');

describe('Authentication Flow', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'Totestuser',
        email: 'Totestuser@example.com',
        password: 'testpassword'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('should login with valid credentials', async () => {
    // Similar test for login
  });

  it('should access user profile with a valid token', async () => {
    // Similar test for accessing the user profile
  });
});
