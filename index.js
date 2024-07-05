const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Leer el archivo JSON
const dataFilePath = path.join(__dirname, 'data.json');
let data = [];

fs.readFile(dataFilePath, 'utf8', (err, jsonData) => {
  if (err) {
    console.error('Error al leer el archivo JSON', err);
    return;
  }
  try {
    data = JSON.parse(jsonData);
    console.log('Datos cargados:', data); // Verificar los datos cargados
  } catch (err) {
    console.error('Error al parsear el archivo JSON', err);
  }
});

// Ruta de búsqueda
app.get('/search', (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (!query) {
    return res.status(400).send({ error: 'Parámetro de búsqueda es requerido' });
  }

  if (!data || !data.length) {
    return res.status(500).send({ error: 'Datos no cargados correctamente' });
  }

  const normalizedQuery = query.toLowerCase();
  const results = [];

  // Iterar sobre todas las leyes y sus características
  data.forEach(ley => {
    ley.characteristics.forEach(characteristic => {
      const title = characteristic.title.toLowerCase();
      const content = characteristic.content.toLowerCase();
      if (title.includes(normalizedQuery) || content.includes(normalizedQuery)) {
        results.push({
          category: ley.category,
          id: characteristic.id,
          title: characteristic.title,
          content: characteristic.content
        });
      }
    });
  });

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  res.send({
    page,
    limit,
    totalResults: results.length,
    totalPages: Math.ceil(results.length / limit),
    results: paginatedResults
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});