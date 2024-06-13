
# Sistema de Inventarios - IUD

Este documento describe cómo configurar y ejecutar la aplicación Inventarios-IUD desarrollada en Node.js y MongoDBAtlas.

## Instrucciones de Ejecución

### 1. Clonar el Repositorio

- Abre tu terminal.
- Ejecuta el siguiente comando para clonar el repositorio:


```bash
git clone https://github.com/LinaSeguro/Inventario-IUDigital.git
cd Inventario-IUDigital
```

### 2. Instalar Dependencias

Asegúrate de tener Node.js y npm instalados.

Ejecuta el siguiente comando para instalar las dependencias:

```bash
npm install
```

### 3. Iniciar el Servidor

- Ejecuta el siguiente comando para iniciar el servidor:

```bash
node index.js
```

### 4. Importar y Probar con Postman

- Descarga la colección de Postman `Sistema de Inventario.postman_collection.json` desde el repositorio.
- Abre Postman y haz clic en "Import" para seleccionar y cargar la colección de solicitudes.
- Asegúrate de que las URLs de las solicitudes en Postman apunten al servidor y puerto definidos en el archivo `index.js`.
- Ejecuta las solicitudes para verificar el funcionamiento de la aplicación.

### Usuarios para Iniciar Sesión:

#### Rol Administrador:
```json
{
    "email": "andrea.serna@example.com",
    "password": "123456"
}
```
#### Rol Docente:
```json
{
    "email": "juan.cardona@example.com",
    "password": "123452"
}
```
### Notas Adicionales

- Asegúrate de tener tu cluster de MongoDB Atlas configurado correctamente y accesible desde tu aplicación.

Estas instrucciones deberían guiarte para configurar, ejecutar y probar la aplicación de Inventarios-IUD de manera efectiva.
