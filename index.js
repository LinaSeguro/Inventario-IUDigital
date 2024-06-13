const express = require('express');
const { getConnection } = require('./db/db-connection-mongo');

const app = express();
const port = 3000;

// Conectar a la base de datos
getConnection();

app.use(express.json())

app.use('/auth', require('./router/auth'));
app.use('/usuario', require('./router/usuario'));
app.use('/marca', require('./router/marca'));
app.use('/tipo-equipo', require('./router/tipoEquipo'));
app.use('/estado-equipo', require('./router/estadoEquipo'));
app.use('/inventario', require('./router/inventario'));


app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});

