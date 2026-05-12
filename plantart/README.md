# 🌿 PlantaCare

Una aplicación para gestionar el cuidado de tus plantas, con seguimiento de riego, fertilización y más.

## 🚀 Despliegue en Netlify con Neon Database

### 1. Configurar Neon Database

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta gratuita.
2. Crea un nuevo proyecto de base de datos.
3. Ve a la sección "SQL Editor" y ejecuta esta consulta para crear la tabla de plantas:

```sql
CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT,
  location TEXT,
  emoji TEXT,
  notes TEXT,
  history JSONB DEFAULT '[]'::jsonb,
  water_schedule JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Ve a "Settings" > "Connection Details" y copia la cadena de conexión (DATABASE_URL).

### 2. Configurar Netlify

1. Conecta tu repositorio de GitHub a Netlify.
2. En "Build settings":
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20` (importante: Vite requiere Node.js 20+)
3. En "Environment variables", agrega:
   - `DATABASE_URL`: Tu cadena de conexión de Neon

### 3. Desplegar

Haz push a tu rama principal y Netlify desplegará automáticamente.

## 🛠 Desarrollo Local

```bash
npm install
npm run dev
```

## 📋 Características

- Seguimiento de riego por estaciones
- Registro de cuidados (riego, fertilización, etc.)
- Interfaz oscura con tema verde
- Búsqueda y filtrado de plantas
- Almacenamiento en base de datos PostgreSQL (Neon)

## 🌐 Acceso Multi-dispositivo

Esta aplicación está diseñada para funcionar en **cualquier dispositivo** con conexión a internet:

- **💻 Computadoras**: Acceso completo desde desktop
- **📱 Móviles**: Interfaz adaptativa para smartphones y tablets
- **📟 Tablets**: Optimizada para pantallas táctiles

Todos los dispositivos acceden a la **misma base de datos** en tiempo real, por lo que verás los mismos datos actualizados en todas partes.

### URL de Producción
Una vez desplegado en Netlify, tendrás una URL como: `https://tu-app-plantart.netlify.app`

Comparte esta URL para acceder desde cualquier dispositivo.
