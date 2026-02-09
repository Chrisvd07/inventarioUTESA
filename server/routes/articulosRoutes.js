import express from 'express';
import { 
  getArticulos, 
  getArticuloById, 
  createArticulo, 
  updateArticulo, 
  deleteArticulo,
  getCategorias,
  searchArticulos
} from '../controllers/articulosController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de artículos
router.get('/', getArticulos);
router.get('/search', searchArticulos);
router.get('/categorias', getCategorias);
router.get('/:id', getArticuloById);
router.post('/', createArticulo);
router.put('/:id', updateArticulo);
router.delete('/:id', deleteArticulo);

export default router;