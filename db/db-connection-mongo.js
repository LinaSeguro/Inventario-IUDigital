const mongoose = require('mongoose');
require('dotenv').config(); 

const getConnection = async () => {
    try {
        const url = process.env.MONGO_URI;
        
        await mongoose.connect(url);
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

module.exports = { getConnection };








