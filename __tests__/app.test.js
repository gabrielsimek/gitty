const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');
    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it.only('should login and redirect users to api/v1/posts', async () => {
    const res = await (
      await request(app).get('/api/v1/github/login/callback')
    ).redirects(1);

    expect(res.redirects).toEqual(expect.stringContaining('/api/v1/posts'));
  });
});
