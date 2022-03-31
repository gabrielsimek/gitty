const pool = require('../utils/pool');

module.exports = class Post {
  id;
  post;
  username;

  constructor(row) {
    this.id = row.id;
    this.post = row.post;
    this.username = row.username;
  }

  static async insert(post, username) {
    if (post.length > 255)
      throw new Error('Posts must be less than 255 characters');
    const { rows } = await pool.query(
      `
      INSERT INTO posts(post, username)
      VALUES($1, $2)
      RETURNING *
      `,
      [post, username]
    );

    if (!rows[0]) return null;
    return new Post(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM posts');
    if (rows.length < 1) return null;
    return rows.map((row) => new Post(row));
  }
};
