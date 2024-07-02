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
  } catch (err) {
    console.error('Error al parsear el archivo JSON', err);
  }
});

// Ruta de búsqueda
app.get('/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ error: 'Parámetro de búsqueda es requerido' });
  }
  
  const results = data.filter(item =>
    item.title.includes(query) || item.content.includes(query)
  );

  res.send(results);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});