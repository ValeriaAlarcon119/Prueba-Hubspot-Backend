# HubSpot Integration Backend

Este proyecto es una aplicación de servidor (backend) diseñada para integrarse con la API de contactos de HubSpot. Sirve como middleware para enviar, recuperar, actualizar, buscar y eliminar contactos en HubSpot.

## Requisitos

- Node.js (versión 14 o superior)
- npm (Node Package Manager)

## Instalación y Ejecución

1. **Clonar el Repositorio:**

   git clone https://github.com/ValeriaAlarcon119/Prueba-Hubspot-Backend.git

2. **Navegar al Directorio del Proyecto:**

    cd Prueba-Hubspot-Backend

3. **Instalar las Dependencias:** 

    npm install

4. **Configurar las Variables de Entorno:**

    CreaR un archivo .env en la raíz del proyecto y agrega tu clave de API de HubSpot. Utiliza el siguiente formato:
    HUBSPOT_API_KEY= clave_api

5. **Iniciar el Servidor con el siguiente comando:**

    npm start
    El servidor debería estar corriendo en http://localhost:4000

6. **Acceder a la Interfaz de Usuario**
   
   Abre un navegador y navega a http://localhost:4000 para acceder a la interfaz de usuario y probar las funcionalidades de la aplicación.

Funcionalidades a verificar:
Crear Contacto: Permite agregar un nuevo contacto a HubSpot a través del formulario visible en la interfaz. En caso de intentar registrar un contacto ya existente en la base de datos o ingresar datos incorrectos para el correo, teléfono o algún campo faltante, se mostrarán mensajes de error.

Recuperar Contacto: Permite recuperar un contacto existente por correo electrónico o visualizar el listado completo de todos los contactos.

Actualizar Información de Contacto: Permite actualizar un contacto existente en HubSpot a través de un formulario similar al de registro. Este formulario captura los datos previamente registrados y permite editarlos. La función está disponible en el listado de contactos, en la acción de editar (icono azul), la cual solicita confirmar la acción antes de actualizar.

Buscar Contacto por Correo Electrónico: Permite buscar un contacto por su correo electrónico ingresando el correo en el cuadro de texto indicado para esta acción.

Eliminar Contacto: Permite eliminar un contacto existente en HubSpot. En el listado de contactos, la acción de eliminar está representada por el icono rojo de "basura". Al seleccionar esta opción, se solicitará una confirmación antes de proceder con la eliminación.


--------------------------------------------------------Pruebas Unitarias---------------------------------------------------------------
Este proyecto utiliza Jest para realizar pruebas unitarias. Las prueba cubren todos los aspectos clave de la funcionalidad, como crear, recuperar, actualizar, buscar y eliminar contactos en HubSpot.

**Instalación de Dependencias para Pruebas:**
Instalamos Jest ejecutando el siguiente comando:

npm install --save-dev jest

**Ejecutar las Pruebas Unitarias:**
Para ejecutar las pruebas unitarias, utiliza el siguiente comando:

npm test

**Consideraciones Importantes para las Pruebas**
Modificar el ID en las pruebas:

Para probar la funcionalidad de actualización o eliminación de contactos, es necesario editar el archivo de pruebas unitarias y reemplazar el ID del contacto por un ID válido de un contacto existente en la base de datos de HubSpot.(Se puede verificar los contactos existentes utilizando la funcionalidad de GET en Postman antes de ejecutar la prueba unitaria ahí visualizamos el listado de ls existentes).
.

**Crear Nuevos Contactos:**

En las pruebas de creación de contactos, asegurarse de usar datos de contacto que no existan previamente en HubSpot en el archivo test.js se pueden reemplazar todos los datos que solicita para crear un contacto asegurandonos que sean nuevos datos y esto creara exitosamente el nuevo contacto. 

**Recuperar un contacto por ID:**

Para recuperar un contacto por ID es necesario adicionar un ID existente en los registros, ya que de lo contrario arrojaria error. 

**Prueba para actualizar un contacto:**

Para actualizar un contacto en el campo ID se debe adidionar el ID de un contacto existente en los registros y despues de enviar los datos que se quieren actualizar correctamente. 

**Prueba para eliminar un contacto:**

Para eliminar un contacto en nuestro archivo debemos editar únicamente el campo ID lo reemplazamos por el ID del contacto que se desea eliminar