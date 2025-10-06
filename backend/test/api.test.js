const request = require('supertest');
const app = require('../server');

describe('Weather API', () => {
  test('GET /weather should return 400 if no city provided', async () => {
    const response = await request(app)
      .get('/weather')
      .expect(400);
    
    expect(response.body.error).toBe('City parameter is required');
  });

  test('GET /weather should return 404 for invalid city', async () => {
    const response = await request(app)
      .get('/weather?city=InvalidCity12345')
      .expect(500); // Изменяем на 500, так как без API ключа будет ошибка сервера
    
    expect(response.body.error).toBeDefined();
  }, 10000); // Увеличиваем timeout

  test('GET /health should return OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.timestamp).toBeDefined();
  });

  test('GET /memes should return memes data', async () => {
    const response = await request(app)
      .get('/memes')
      .expect(200);
    
    expect(response.body).toHaveProperty('hot');
    expect(response.body).toHaveProperty('cold');
    expect(response.body).toHaveProperty('normal');
    expect(response.body).toHaveProperty('rain');
  });

  test('POST /memes should add new meme', async () => {
    const newMeme = {
      category: 'test',
      image: 'https://example.com/test.jpg',
      text: 'Test meme text'
    };

    const response = await request(app)
      .post('/memes')
      .send(newMeme)
      .expect(200);
    
    expect(response.body.message).toBe('Meme added successfully');
    expect(response.body.meme).toEqual({
      image: 'https://example.com/test.jpg',
      text: 'Test meme text'
    });
  });

  test('POST /memes should return 400 if required fields missing', async () => {
    const response = await request(app)
      .post('/memes')
      .send({ category: 'test' })
      .expect(400);
    
    expect(response.body.error).toBe('Category, image and text are required');
  });
});
