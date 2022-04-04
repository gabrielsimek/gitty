const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github.js');

describe('posts routes', () => {
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

    res = await agent
      .post('/api/v1/posts')
      .send({ post: Array(256).fill('a').join('') });

    expect(res.status).not.toBe(200);
    expect(res.body.message).toEqual('Posts must be less than 255 characters');
  });

  it('allows authenticated users to view all posts', async () => {
    const agent = request.agent(app);

    const mockPost = { post: 'example post', username: 'fake_github_user' };

    let res = await agent.get('/api/v1/posts');

    expect(res.status).toBe(401);
    expect(res.body.message).toEqual('You must be logged in to continue');

    await agent.get('/api/v1/github/login/callback?code=123').redirects(1);

    const posts = await Promise.all(
      [...Array(3)].map(async (_, i) => {
        const { body } = await agent
          .post('/api/v1/posts')
          .send({ ...mockPost, post: mockPost.post + i });
        return body;
      })
    );

    res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual(expect.arrayContaining(posts));
  });
});
