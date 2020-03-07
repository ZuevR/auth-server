const request = require('supertest');
const app = require('../../src/app');
const models = require('../../src/models');
const { generateAccessToken } = require('../../src/helpers/perform-jwt');

let userData = {};

beforeEach(() => {
  userData = {
    firstName: 'Roman',
    lastName: 'Zuev',
    email: 'ZuevRG@yandex.ru',
    password: 'a483233ce'
  };
});

describe('Sign up', () => {

  it('should creates a new user', async () => {

    const res = await request(app)
      .post('/api/v1/auth/sign-up')
      .send(userData);

    expect(res.statusCode).toEqual(201);
    expect.objectContaining({
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      updatedAt: expect.any(Date)
    });
    expect(res.body).not.toHaveProperty('password');
  });

  it('should returns 400 status code if the required field is not specified', async () => {

    delete userData.email;

    const res = await request(app)
      .post('/api/v1/auth/sign-up')
      .send(userData);

    expect(res.statusCode).toEqual(400);
  });

  it('should returns 409 status code if break the unique constraint', async () => {

    const res = await request(app)
      .post('/api/v1/auth/sign-up')
      .send(userData);

    expect(res.statusCode).toEqual(409);
  });

});

describe('Confirm registration', () => {

  it('should returns 200 if successfully confirmed', async () => {

    userData.userId = 3;
    const { verificationCode } = await models.User.findByPk(userData.userId);
    userData.confirmationCode = verificationCode;

    const res = await request(app)
      .post('/api/v1/auth/confirm')
      .send({
        confirmationCode: userData.confirmationCode,
        userId: userData.userId
      });

    expect(res.statusCode).toEqual(200);
  });

  it('should returns 400 if verification code is expired', async () => {
    const res = await request(app)
      .post('/api/v1/auth/confirm')
      .send({
        confirmationCode: 111111,
        userId: 1
      });

    expect(res.statusCode).toEqual(400);
  });

});

describe('Sign in', () => {

  it('should successfully login user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.token === 'string').toBeTruthy();
    expect(typeof res.body.refreshToken === 'string').toBeTruthy();

    const refreshTokenRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: res.body.refreshToken
      });

    expect(res.statusCode).toEqual(200);
    expect(typeof refreshTokenRes.body.token === 'string').toBeTruthy();
    expect(typeof refreshTokenRes.body.refreshToken === 'string').toBeTruthy();
  });

  it('should returns 403 on invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: 'invalid',
        password: 'invalid'
      });

    expect(res.statusCode).toEqual(403);
  });

});

describe('Refresh', () => {

  it('should returns new access token using refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: 'd0b30b81-8c9f-4ffe-8a98-35b815a4238d'
      });

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.token === 'string').toBeTruthy();
    expect(typeof res.body.refreshToken === 'string').toBeTruthy();
  });

  it('should returns 404 on invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: 'INVALID_REFRESH_TOKEN'
      });

    expect(res.statusCode).toEqual(404);
  });

  it('should use refresh only once', async () => {
    const firstResponse = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: '3a2d2d37-118f-4d68-bad5-07a7eaf729fd' });
    expect(firstResponse.statusCode).toEqual(200);

    const secondResponse = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: '3a2d2d37-118f-4d68-bad5-07a7eaf729fd' });

    expect(secondResponse.statusCode).toEqual(404);
  });

  it.todo('Multiple refresh tokens are valid');

});

describe('Logout from all devices', () => {

  it('should returns 401 on expired token', async () => {
    const expiredAccessToken = generateAccessToken({ id: 1 }, '1ms');

    const res = await request(app)
      .get('/api/v1/auth/logout-from-all')
      .set({ Authorization: `Bearer ${expiredAccessToken}` });

    expect(res.statusCode).toEqual(401);
  });

  it('should make refresh token is invalid on logout', async () => {
    const validAccessToken = generateAccessToken({ id: 2 }, 300);

    const logoutRes = await request(app)
      .get('/api/v1/auth/logout-from-all')
      .set({ Authorization: `Bearer ${validAccessToken}` });

    expect(logoutRes.statusCode).toEqual(200);

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: '795f7993-a066-4b8b-9c2e-1a90c1353e52' });

    expect(res.statusCode).toEqual(404);
  });
});

describe('Logout from one device', () => {

  it('should returns 200 status code', async () => {
    const loggedInUserData = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password
      });

    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set({ Authorization: `Bearer ${loggedInUserData.body.token}` })
      .send({ rt: loggedInUserData.body.refreshToken });

    expect(res.statusCode).toEqual(200);
  });
});

afterAll(async () => {
  await models.sequelize.close();
});
