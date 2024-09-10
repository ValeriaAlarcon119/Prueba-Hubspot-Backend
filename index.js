// Cargar las variables de entorno desde un archivo .env
require('dotenv').config();

// Importar las dependencias necesarias
const express = require('express');
const axios = require('axios');
const path = require('path');

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para analizar cuerpos JSON en las solicitudes
app.use(express.json());

// Configuración de la URL base para la API de HubSpot y la clave API
const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
const hubspotApiKey = process.env.HUBSPOT_API_KEY;
// Imprimir la clave API para verificar
console.log('HubSpot API Key:', hubspotApiKey); 

// Ruta para crear un nuevo contacto // Extraer datos del cuerpo de la solicitud  // Realizar una solicitud POST a la API de HubSpot para crear el contacto
// Devolver la respuesta con el contacto creado // Registrar el error// Devolver error al cliente
app.post('/contacts', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body; 
  try {
    const response = await axios.post(hubspotUrl, {
      properties: {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotApiKey}`
      }
    });
    res.status(201).json(response.data); 
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message); 
    res.status(500).json({ error: 'Error al crear el contacto en HubSpot' }); 
  }
});

// Ruta para actualizar la información de un contacto existente // Extraer ID del contacto y propiedades actualizadas // Validar datos
// Realizar una solicitud PATCH a la API de HubSpot para actualizar el contacto// URL con ID del contacto // Propiedades a actualizar
// Incluir token de autorización  // Devolver la respuesta con el contacto actualizado // Registrar el error // Devolver error al cliente
app.put('/update-contact', async (req, res) => {
  const { contactId, updatedProperties } = req.body; 
  if (!contactId || !updatedProperties) {
    return res.status(400).json({ error: 'ID del contacto o propiedades no proporcionadas.' }); 
  }
  try {
    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, 
      { properties: updatedProperties }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubspotApiKey}` 
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error al actualizar el contacto:', error.response ? error.response.data : error.message); 
    res.status(500).json({ error: 'Error al actualizar el contacto en HubSpot' }); 
  }
});

// Ruta para buscar un contacto por correo electrónico // Extraer correo electrónico de los parámetros de la solicitud
 // Realizar una solicitud POST para buscar el contacto por correo electrónico // Si no se encuentra el contacto
 // Devolver el contacto encontrado  // Registrar el error// Devolver error al cliente
app.get('/contacts/email/:email', async (req, res) => {
  const email = req.params.email; 
  try {
    const response = await axios.post(`${hubspotUrl}/search`, {
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['firstname', 'lastname', 'email', 'phone']
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubspotApiKey}`
      }
    });
    if (response.data.results.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' }); 
    }
    res.status(200).json(response.data.results[0]); 
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al buscar el contacto en HubSpot' }); 
  }
});

// Ruta para obtener todos los contactos, con paginación // Manejo de la paginación // Lista para almacenar todos los contactos 
// Construir la URL de la solicitud con paginación si es necesario  // Realizar una solicitud POST para obtener los contactos 
// Propiedades a recuperar // Límite de contactos por solicitud // Obtener contactos de la respuesta // Concatenar contactos a la lista total // Actualizar el valor de 'after' si existe  
// Continuar hasta que no haya más contactos // Devolver todos los contactos obtenidos // Registrar el error  // Devolver error al cliente
app.get('/contacts', async (req, res) => {
  let after = req.query.after || null; 
  let allContacts = []; 
  try {
    do {
      const url = after ? `${hubspotUrl}?after=${after}` : hubspotUrl;
      const response = await axios.post(`${hubspotUrl}/search`, {
        properties: ['firstname', 'lastname', 'email', 'phone'], 
        limit: 100, 
        after: after
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubspotApiKey}`
        }
      });
      const contacts = response.data.results; 
      allContacts = allContacts.concat(contacts); 
      after = response.data.paging?.next?.after || null; 

    } while (after);

    res.status(200).json({ results: allContacts }); 
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message); 
    res.status(500).json({ error: 'Error al listar los contactos de HubSpot' });
  }
});

// Ruta para obtener detalles de un contacto por ID // Extraer ID del contacto de los parámetros
// Realizar una solicitud GET para obtener los detalles del contacto por ID // Incluir token de autorización
// Devolver los detalles del contacto // Registrar el error // Devolver error al cliente
app.get('/contacts/:id', async (req, res) => {
  const contactId = req.params.id; 
  try {
    const response = await axios.get(`${hubspotUrl}/${contactId}?properties=firstname,lastname,email,phone`, {
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}` 
      }
    });
    res.status(200).json(response.data); 
  } catch (error) {
    console.error('Error al obtener el contacto:', error.response ? error.response.data : error.message); 
    res.status(error.response ? error.response.status : 500).json({
      error: 'Error al obtener los detalles del contacto.',
      details: error.response ? error.response.data : error.message
    }); 
  }
});

// Ruta para eliminar un contacto, par esto es necesario extraer ID del contacto de los parámetros 
// Realizamos una solicitud DELETE para eliminar el contacto y para esto oincluimos el token de autorización
// Se devuelve estado 204 para indicar eliminación exitosa o registramos y devolvemos error al cliente segun sea el caso.
app.delete('/contacts/:id', async (req, res) => {
  const contactId = req.params.id; 

  try {
    await axios.delete(`${hubspotUrl}/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${hubspotApiKey}` 
      }
    });
    res.status(204).send(); 
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message); 
    res.status(500).json({ error: 'Error al eliminar el contacto en HubSpot' }); 
  }
});

// Ruta para servir el archivo index.html desde el directorio público y enviar el archivo HTML al cliente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

// Configuración y arranque del servidor e imprimir mensaje de inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`); 
});

// Exportar la aplicación para pruebas y otros usos
module.exports = app;
