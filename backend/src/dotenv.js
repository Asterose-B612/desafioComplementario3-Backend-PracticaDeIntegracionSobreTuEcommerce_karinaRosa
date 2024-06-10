/**dotenv.js: Este archivo se encarga de cargar las variables de entorno y exportarlas para que puedan ser usadas en otros archivos de la aplicación. */


import dotenv from 'dotenv'
// Carga las variables de entorno desde el archivo .env
dotenv.config();
// Define un objeto con las variables de entorno necesarias para la aplicación
const varenv = {
    mongo_url: process.env.MONGO_BD_URL,

    cookies_secret: process.env.COOKIES_SECRET,

    session_secret: process.env.SESSION_SECRET,

    jwt_secret: process.env.JWT_SECRET,

    salt: process.env.SALT,

    email_user: process.env.EMAIL_USER,

    email_pass: process.env.EMAIL_PASS
}

export default varenv;

