const request = require('supertest');
const app = require('../app');
const userData = require('./mock/user_data');

describe('#routes', () => {
  beforeEach(async () => {
    await request(app)
    .post('/person')
    .send(
      {
        "cpf": "42303146802",
        "name": "Emanuel Biet",
      },
    );
  });

  it('should return 200 when user is created', async () => {
    const response = await request(app)
      .post('/person')
      .send(
        {
          "cpf": "42303146801",
          "name": "Emanuel Biet",
        },
      );

      expect(response.statusCode).toBe(200);
  });

  it('should return 400 if cpf is invalid', async () => {
    const response = await request(app)
      .post('/person')
      .send(
        {
          "cpf": "invalid",
          "name": "Emanuel Biet",
        },
      );

      expect(response.statusCode).toBe(400);
  });

  it('should return 400 if user already exists', async () => {
    const response = await request(app)
      .post('/person')
      .send(
        {
          "cpf": "42303146802",
          "name": "Emanuel Biet",
        },
      );

      expect(response.statusCode).toBe(400);
  });

  it('should return an user', async () => {
    const response = await request(app)
      .post('/person')
      .send(
        {
          "cpf": "42303146802",
          "name": "Emanuel Biet",
        },
      );

      expect(response.statusCode).toBe(400);
  });

  it('should return an user', async () => {
    const response = await request(app)
      .get('/person/42303146802')

    expect(response.body).toStrictEqual({
      "cpf": "42303146802",
      "name": "Emanuel Biet",
    });
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 if user not found', async () => {
    const response = await request(app)
      .get('/person/42303146803')

    expect(response.statusCode).toBe(404);  
  });

  it('should create a relationship', async () => {
    await request(app)
      .post('/person')
      .send(
        {
          "cpf": "42303146805",
          "name": "Ricardo",
        },
      );
    
    const response = await request(app)
      .post('/relationship')
      .send(
        {
          "cpf1": "42303146802",
          "cpf2": "42303146805",
        },
      );

    expect(response.statusCode).toBe(200);
  });

  it('should return 400 if relationship already exists', async () => {
    const response = await request(app)
      .post('/relationship')
      .send(
        {
          "cpf1": "42303146802",
          "cpf2": "42303146805",
        },
      );

    expect(response.statusCode).toBe(400);
  });

  it('should return 404 if one of users doesnt exists', async () => {
    const response = await request(app)
      .post('/relationship')
      .send(
        {
          "cpf1": "42303146807",
          "cpf2": "42303146805",
        },
      );

    expect(response.statusCode).toBe(404);
  });

  describe('#recommendations', () => {
    it('should show recommendations', async () => {
      const response = await request(app)
        .get(`/recommendations/${userData[0].cpf}`)
  
      expect(response.body).toStrictEqual(
        [
          "1111111111D",
          "2222222222E",
        ]
      )
      expect(response.statusCode).toBe(200);
    });

    it('should return 400 if cpf is invalid', async () => {
      const response = await request(app)
      .get(`/recommendations/123456789`)

      
      expect(response.statusCode).toBe(400);
    });
  });

  it('should delete clean all data', async () => {
    const response = await request(app)
      .delete('/clean');

    expect(response.statusCode).toBe(200);
  });
});
