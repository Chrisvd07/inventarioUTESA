import express from 'express';
import { 
  getMovimientos, 
  getMovimientoById, 
  createMovimiento,
  getEstadisticas
} from '../controllers/movimientosController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de movimientos
router.get('/', getMovimientos);
router.get('/estadisticas', getEstadisticas);
router.get('/:id', getMovimientoById);
router.post('/', createMovimiento);

export default router;