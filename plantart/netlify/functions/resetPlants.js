const { Client } = require('pg')

const SAMPLE_PLANTS = [
  {
    name: "Monstera Thai Constellation",
    species: "Monstera deliciosa",
    location: "Salón",
    emoji: "🌿",
    notes: "Variegada única, luz indirecta brillante",
    history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 }
  },
  {
    name: "Planta del dinero",
    species: "Epipremnum pinnatum",
    location: "Oficina",
    emoji: "💚",
    notes: "Trae prosperidad, fácil de cuidar",
    history: [],
    waterSchedule: { spring: 5, summer: 4, autumn: 5, winter: 6 }
  },
  {
    name: "Cinta bicolor",
    species: "Chlorophytum comosum",
    location: "Ventana",
    emoji: "🎀",
    notes: "Produce hijuelos naturalmente",
    history: [],
    waterSchedule: { spring: 6, summer: 5, autumn: 6, winter: 7 }
  },
  {
    name: "Árbol de jade 'Orejas de Shrek'",
    species: "Crassula ovata",
    location: "Terraza",
    emoji: "🌳",
    notes: "Suculenta, muy resistente a sequía",
    history: [],
    waterSchedule: { spring: 12, summer: 10, autumn: 15, winter: 20 }
  },
  {
    name: "Cala",
    species: "Zantedeschia aethiopica",
    location: "Baño",
    emoji: "🤍",
    notes: "Flores elegantes blancas, requiere humedad",
    history: [],
    waterSchedule: { spring: 3, summer: 2, autumn: 3, winter: 4 }
  },
  {
    name: "Philodendron Lemon Lime",
    species: "Philodendron hederaceum",
    location: "Dormitorio",
    emoji: "🍋",
    notes: "Hojas amarillo limón brillantes",
    history: [],
    waterSchedule: { spring: 7, summer: 6, autumn: 7, winter: 8 }
  },
  {
    name: "Philodendron Micans",
    species: "Philodendron hederaceum micans",
    location: "Estudio",
    emoji: "✨",
    notes: "Hojas iridiscentes, luz indirecta",
    history: [],
    waterSchedule: { spring: 7, summer: 6, autumn: 7, winter: 8 }
  },
  {
    name: "Poto Marble Queen",
    species: "Epipremnum aureum",
    location: "Salón",
    emoji: "👑",
    notes: "Moteado blanco y verde, trepa fácil",
    history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 }
  },
  {
    name: "Scindapsus pictus",
    species: "Scindapsus pictus",
    location: "Cocina",
    emoji: "🎨",
    notes: "Manchitas plateadas, espectacular",
    history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 8, winter: 9 }
  },
  {
    name: "Poto Golden",
    species: "Epipremnum aureum",
    location: "Pasillo",
    emoji: "💛",
    notes: "Hojas doradas, crece rápido",
    history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 }
  },
  {
    name: "Philodendron Scandens",
    species: "Philodendron hederaceum",
    location: "Ventana",
    emoji: "🌱",
    notes: "Trepadora clásica, muy adaptable",
    history: [],
    waterSchedule: { spring: 7, summer: 6, autumn: 7, winter: 8 }
  },
  {
    name: "Poto Epipremnum",
    species: "Epipremnum pinnatum",
    location: "Balcón",
    emoji: "🌿",
    notes: "Poto resistente y decorativo",
    history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 }
  },
  {
    name: "Ficus elastica Robusta",
    species: "Ficus elastica",
    location: "Entrada",
    emoji: "🍃",
    notes: "Árbol robusto, hojas grandes y brillantes",
    history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 }
  },
  {
    name: "Pilea peperomioides",
    species: "Pilea peperomioides",
    location: "Mesa",
    emoji: "🪴",
    notes: "Moneda china, produce hijuelos",
    history: [],
    waterSchedule: { spring: 6, summer: 5, autumn: 6, winter: 7 }
  }
];

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query('DELETE FROM plants');

    const insertedPlants = [];
    for (const plant of SAMPLE_PLANTS) {
      const query = `
        INSERT INTO plants (name, species, location, emoji, notes, history, water_schedule)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [
        plant.name,
        plant.species || null,
        plant.location || null,
        plant.emoji || '🌿',
        plant.notes || null,
        JSON.stringify(plant.history || []),
        JSON.stringify(plant.waterSchedule || {})
      ];

      const result = await client.query(query, values);
      insertedPlants.push(result.rows[0]);
    }

    await client.query('COMMIT');
    await client.end();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: JSON.stringify(insertedPlants)
    };
  } catch (error) {
    console.error('Error resetting plants:', error);
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};