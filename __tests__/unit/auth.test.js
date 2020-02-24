test.todo('User can successfully login');
test.todo('User gets 403 on invalid credentials');

const request = require('supertest');
const app = require('../../src/app');
const models = require('../../src/models');

describe('Sign up', () => {

  let data = {};

  beforeEach(() => {
    data = {
      firstName: 'Roman',
      lastName: 'Zuev',
      email: 'ZuevRG@yandex.ru',
      password: 'password'
    }
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  it('should create a new user', async () => {

    const res = await request(app)
      .post('/api/v1/auth/sign-up')
      .send(data);

    expect(res.statusCode).toEqual(201);
    expect.objectContaining({
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      updatedAt: expect.any(Date)
    });
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return 400 status code if the required field is not specified', async () => {

    delete data.email;

    const res = await request(app)
      .post('/api/v1/auth/sign-up')
      .send(data);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 409 status code if break the unique constraint', async () => {

    const res = await request(app)
      .post('/api/v1/auth/sign-up')
      .send(data);

    expect(res.statusCode).toEqual(409);
  });

});

describe('Confirm registration', () => {

  const data = {
    userId: 1,
    confirmationCode: 745513
  };

  it('should not be expired', async () => {
    const res = await request(app)
      .post('/api/v1/auth/confirm')
      .send(data);

    expect(res.statusCode).toEqual(200);
  });

});
