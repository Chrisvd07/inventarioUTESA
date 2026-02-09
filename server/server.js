import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import articulosRoutes from './routes/articulosRoutes.js';
import movimientosRoutes from './routes/movimientosRoutes.js';
// Configuración
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/movimientos', movimientosRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema de Inventario',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      articulos: {
        getAll: 'GET /api/articulos',
        getById: 'GET /api/articulos/:id',
        create: 'POST /api/articulos',
        update: 'PUT /api/articulos/:id',
        delete: 'DELETE /api/articulos/:id',
        search: 'GET /api/articulos/search?q=term',
        categorias: 'GET /api/articulos/categorias'
      },
      movimientos: {
        getAll: 'GET /api/movimientos',
        getById: 'GET /api/movimientos/:id',
        create: 'POST /api/movimientos',
        estadisticas: 'GET /api/movimientos/estadisticas'
      }
    }
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});