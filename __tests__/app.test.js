const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github.js');
describe('auth routes', () => {
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

  it('should login and redirect users to api/v1/posts', async () => {
    // const agent = request.agent(app);
    const res = await request(app)
      .get('/api/v1/github/login/callback?code=123')
      .redirects(1);

    expect(res.redirects[0]).toEqual(expect.stringContaining('/api/v1/posts'));
  });
});

describe.only('posts routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should allow logged in users to create a post', async () => {
    const agent = request.agent(app);

    const mockPost = { post: 'example post', username: 'fake_github_user' };

    let res = await agent.post('/api/v1/posts').send(mockPost);

    expect(res.status).toBe(401);
    expect(res.body.message).toEqual('You must be logged in to continue');

    await agent.get('/api/v1/github/login/callback?code=123').redirects(1);

    res = await agent.post('/api/v1/posts').send(mockPost);
    
    expect(res.body).toEqual({
      ...mockPost,
      id: expect.any(String),
    });
  });
});
