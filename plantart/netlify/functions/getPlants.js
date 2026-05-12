const { Client } = require('pg')

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()

    const result = await client.query('SELECT * FROM plants ORDER BY id')
    await client.end()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify(result.rows)
    }
  } catch (error) {
    console.error('Error:', error)
    await client.end() // Ensure client is closed on error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}