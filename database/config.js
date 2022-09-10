const mongoose = require('mongoose'); // Permite la conexión e interacción entre MongoDB y NodeJS

const dbConnection = async() => {
    
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos online');


    } catch (error) {
        console.log(error);
        throw new Error('Error al momento de iniciar la base de datos')
    }

}

module.exports = {
    dbConnection
}