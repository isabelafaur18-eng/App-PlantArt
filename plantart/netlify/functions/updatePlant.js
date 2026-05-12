const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    await client.connect()

    const plant = JSON.parse(event.body)
    const query = `
      UPDATE plants
      SET name = $1, species = $2, location = $3, emoji = $4, notes = $5, history = $6, water_schedule = $7
      WHERE id = $8
      RETURNING *
    `
    const values = [
      plant.name,
      plant.species || null,
      plant.location || null,
      plant.emoji || '🌿',
      plant.notes || null,
      JSON.stringify(plant.history || []),
      JSON.stringify(plant.waterSchedule || {}),
      plant.id
    ]

    const result = await client.query(query, values)
    await client.end()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify(result.rows[0])
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}