const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('testy test', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('tests', async () => {
    const res = await await request(app)
      .get('/api/v1/github/login')
      .redirects(2);

    console.log('res', res.redirects);
  });
});
