const request = require('supertest');
const app = require('./index'); 

describe('HubSpot API', () => {

    // Prueba para crear un nuevo contacto
    it('should create a contact', async () => {
      const response = await request(app)
        .post('/contacts')
        .send({
          firstName: 'karina',
          lastName: 'salcedo',
          email: 'karina@hotmail.com',
          phone: '123456789'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  
    // Prueba para recuperar un contacto por ID
    it('should retrieve a contact by ID', async () => {
      const contactId = '56415871506'; 
  
      const response = await request(app)
        .get(`/contacts/${contactId}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('properties');
    });
  
    // Prueba para actualizar un contacto
    it('should update a contact', async () => {
      const contactId = '56451949686'; 
  
      const response = await request(app)
        .put('/update-contact')
        .send({
          contactId: contactId,
          updatedProperties: {
            firstname: 'Alejandro',
            lastname: 'Lopez',
            email: 'alejito@gmail.com',
            phone: '987656666'
          }
        });
  
      expect(response.status).toBe(200);
      expect(response.body.properties).toHaveProperty('firstname', 'Alejandro');
    });
  
    // Prueba para eliminar un contacto
    it('should delete a contact', async () => {
      const contactId = '56452015644'; 
  
      const response = await request(app)
        .delete(`/contacts/${contactId}`);
  
      // Verifica que el estado de la respuesta sea 204 (sin contenido, exitoso)
      expect(response.status).toBe(204);
    });
  
    // Prueba para buscar un contacto por correo electrónico
    it('should search contact by email', async () => {
      const email = 'john.doe@example.com'; 
  
      const response = await request(app)
        .get(`/contacts/email/${email}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('properties');
    });
  
});
