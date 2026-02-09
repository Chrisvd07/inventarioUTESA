import db from '../config/database.js';

// Obtener todos los artículos
export const getArticulos = async (req, res) => {
  try {
    const [articulos] = await db.query(`
      SELECT a.*, s.cantidad as stock_actual, s.stock_minimo, s.stock_maximo, s.ubicacion
      FROM articulos a
      LEFT JOIN stock s ON a.id = s.articulo_id
      WHERE a.activo = true
      ORDER BY a.fecha_creacion DESC
    `);

    res.json(articulos);
  } catch (error) {
    console.error('Error en getArticulos:', error);
    res.status(500).json({ message: 'Error al obtener artículos' });
  }
};

// Obtener un artículo por ID
export const getArticuloById = async (req, res) => {
  try {
    const { id } = req.params;

    const [articulos] = await db.query(`
      SELECT a.*, s.cantidad as stock_actual, s.stock_minimo, s.stock_maximo, s.ubicacion
      FROM articulos a
      LEFT JOIN stock s ON a.id = s.articulo_id
      WHERE a.id = ? AND a.activo = true
    `, [id]);

    if (articulos.length === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json(articulos[0]);
  } catch (error) {
    console.error('Error en getArticuloById:', error);
    res.status(500).json({ message: 'Error al obtener artículo' });
  }
};

// Crear nuevo artículo
export const createArticulo = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { codigo, nombre, descripcion, categoria, precio_compra, precio_venta, stock_inicial, stock_minimo, stock_maximo, ubicacion } = req.body;

    // Validar campos requeridos
    if (!codigo || !nombre || !categoria) {
      return res.status(400).json({ message: 'Código, nombre y categoría son requeridos' });
    }

    // Verificar si el código ya existe
    const [existing] = await connection.query('SELECT id FROM articulos WHERE codigo = ?', [codigo]);
    
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'El código del artículo ya existe' });
    }

    // Insertar artículo
    const [resultArticulo] = await connection.query(
      'INSERT INTO articulos (codigo, nombre, descripcion, categoria, precio_compra, precio_venta) VALUES (?, ?, ?, ?, ?, ?)',
      [codigo, nombre, descripcion || null, categoria, precio_compra || 0, precio_venta || 0]
    );

    const articuloId = resultArticulo.insertId;

    // Insertar stock inicial
    const stockInicialValue = stock_inicial || 0;
    await connection.query(
      'INSERT INTO stock (articulo_id, cantidad, stock_minimo, stock_maximo, ubicacion) VALUES (?, ?, ?, ?, ?)',
      [articuloId, stockInicialValue, stock_minimo || 0, stock_maximo || 0, ubicacion || null]
    );

    // Si hay stock inicial, crear movimiento de entrada
    if (stockInicialValue > 0) {
      await connection.query(
        'INSERT INTO movimientos (articulo_id, usuario_id, tipo_movimiento, cantidad, motivo) VALUES (?, ?, ?, ?, ?)',
        [articuloId, req.userId, 'entrada', stockInicialValue, 'Stock inicial']
      );
    }

    await connection.commit();

    // Obtener el artículo completo creado
    const [nuevoArticulo] = await connection.query(`
      SELECT a.*, s.cantidad as stock_actual, s.stock_minimo, s.stock_maximo, s.ubicacion
      FROM articulos a
      LEFT JOIN stock s ON a.id = s.articulo_id
      WHERE a.id = ?
    `, [articuloId]);

    res.status(201).json({
      message: 'Artículo creado exitosamente',
      articulo: nuevoArticulo[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en createArticulo:', error);
    res.status(500).json({ message: 'Error al crear artículo' });
  } finally {
    connection.release();
  }
};

// Actualizar artículo
export const updateArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, categoria, precio_compra, precio_venta, stock_minimo, stock_maximo, ubicacion } = req.body;

    // Verificar si el artículo existe
    const [existing] = await db.query('SELECT id FROM articulos WHERE id = ? AND activo = true', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Verificar si el código ya existe en otro artículo
    if (codigo) {
      const [duplicado] = await db.query('SELECT id FROM articulos WHERE codigo = ? AND id != ?', [codigo, id]);
      
      if (duplicado.length > 0) {
        return res.status(400).json({ message: 'El código del artículo ya existe' });
      }
    }

    // Actualizar artículo
    await db.query(
      `UPDATE articulos SET 
        codigo = COALESCE(?, codigo),
        nombre = COALESCE(?, nombre),
        descripcion = ?,
        categoria = COALESCE(?, categoria),
        precio_compra = COALESCE(?, precio_compra),
        precio_venta = COALESCE(?, precio_venta)
      WHERE id = ?`,
      [codigo, nombre, descripcion, categoria, precio_compra, precio_venta, id]
    );

    // Actualizar stock si se proporcionaron valores
    if (stock_minimo !== undefined || stock_maximo !== undefined || ubicacion !== undefined) {
      await db.query(
        `UPDATE stock SET 
          stock_minimo = COALESCE(?, stock_minimo),
          stock_maximo = COALESCE(?, stock_maximo),
          ubicacion = ?
        WHERE articulo_id = ?`,
        [stock_minimo, stock_maximo, ubicacion, id]
      );
    }

    // Obtener el artículo actualizado
    const [articuloActualizado] = await db.query(`
      SELECT a.*, s.cantidad as stock_actual, s.stock_minimo, s.stock_maximo, s.ubicacion
      FROM articulos a
      LEFT JOIN stock s ON a.id = s.articulo_id
      WHERE a.id = ?
    `, [id]);

    res.json({
      message: 'Artículo actualizado exitosamente',
      articulo: articuloActualizado[0]
    });

  } catch (error) {
    console.error('Error en updateArticulo:', error);
    res.status(500).json({ message: 'Error al actualizar artículo' });
  }
};

// Eliminar artículo (soft delete)
export const deleteArticulo = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el artículo existe
    const [existing] = await db.query('SELECT id FROM articulos WHERE id = ? AND activo = true', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Soft delete - marcar como inactivo
    await db.query('UPDATE articulos SET activo = false WHERE id = ?', [id]);

    res.json({ message: 'Artículo eliminado exitosamente' });

  } catch (error) {
    console.error('Error en deleteArticulo:', error);
    res.status(500).json({ message: 'Error al eliminar artículo' });
  }
};

// Obtener categorías únicas
export const getCategorias = async (req, res) => {
  try {
    const [categorias] = await db.query(`
      SELECT DISTINCT categoria 
      FROM articulos 
      WHERE activo = true AND categoria IS NOT NULL
      ORDER BY categoria
    `);

    res.json(categorias.map(c => c.categoria));

  } catch (error) {
    console.error('Error en getCategorias:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

// Buscar artículos
export const searchArticulos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
    }

    const searchTerm = `%${q}%`;

    const [articulos] = await db.query(`
      SELECT a.*, s.cantidad as stock_actual, s.stock_minimo, s.stock_maximo, s.ubicacion
      FROM articulos a
      LEFT JOIN stock s ON a.id = s.articulo_id
      WHERE a.activo = true 
        AND (a.codigo LIKE ? OR a.nombre LIKE ? OR a.categoria LIKE ?)
      ORDER BY a.nombre
    `, [searchTerm, searchTerm, searchTerm]);

    res.json(articulos);

  } catch (error) {
    console.error('Error en searchArticulos:', error);
    res.status(500).json({ message: 'Error al buscar artículos' });
  }
};