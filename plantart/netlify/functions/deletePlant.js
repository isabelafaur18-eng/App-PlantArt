const { Client } = require('pg')

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()

    const plantId = event.queryStringParameters?.id
    if (!plantId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Plant ID is required' })
      }
    }

    const query = 'DELETE FROM plants WHERE id = $1 RETURNING *'
    const values = [plantId]

    const result = await client.query(query, values)
    await client.end()

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Plant not found' })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify({ message: 'Plant deleted successfully', plant: result.rows[0] })
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