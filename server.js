const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const Participante = require('./models/participante');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint de registro - actualizado para manejar errores
app.post('/api/registro', async (req, res) => {
  try {
    // Validación básica
    if (!req.body || !req.body.nombre || !req.body.apellidos) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos'
      });
    }

    const participante = await Participante.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Registro completado con éxito',
      data: participante
    });
  } catch (error) {
    console.error('Error al guardar el registro:', error);
    res.status(400).json({
      success: false,
      message: 'Error al procesar el registro',
      error: error.message
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});