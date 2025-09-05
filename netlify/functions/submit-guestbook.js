const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { name, message, attending } = JSON.parse(event.body);
  if(!name || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: '姓名和留言不能为空' }) };
  }
  const client = new Client({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    await client.query(
      'INSERT INTO guestbook (name, message, attending, created_at) VALUES ($1, $2, $3, NOW())',
      [name, message, attending]
    );
    await client.end();
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
