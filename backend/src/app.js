//*******IMPORTACIONES******************

// Se importa el módulo Express, que es un marco de aplicación web para Node.js. Esto es necesario para poder crear y configurar nuestro servidor web.
import express from 'express'
import cors from 'cors'
// Se mporta el paquete mongoose, que es una biblioteca de modelado de objetos para MongoDB en Node.js. Lo utilizo en mi aplicación Node.js para interactuar con bases de datos MongoDB de manera más sencilla y eficiente. mongoose proporciona una capa de abstracción sobre las operaciones de MongoDB, lo que facilita la definición de modelos, la validación de datos y la realización de consultas a la base de datos.
import mongoose from 'mongoose';
import messageModel from './models/messages.js'
import indexRouter from './routes/indexRouter.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport/passport.js'
// Importa el módulo 'varenv' desde el archivo './dotenv.js'. Contiene funcionalidad relacionada con la configuración de variables de entorno, como cargar variables desde un archivo .env. Estas variables suelen contener información sensible o de configuración, como claves de API o URL de bases de datos.
//esta importando basicamente el config.
import varenv from './dotenv.js';
import { __dirname } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io' //llaves es una dependencia
import { generateRandomProducts } from './controllers/productController.js';//importo la función generateRandomProducts desde productController.js
import { generateRandomUsers } from './controllers/userController.js';//importo la función generateRandomUsers desde userController.js
import { addLogger } from './utils/logger.js';


//console.log(__dirname)





//  CONFIGURACIONES Y DECLARACIONES   *********
// Cors, Server, Mongo DB Conection


// Se crea una instancia de Express, que será nuestra aplicación de Express, a través de la cual definiremos rutas, configuraremos middleware y realizaremos otras tareas relacionadas con el manejo de solicitudes y respuestas HTTP. (es para configurar el servidor.)
const app = express();

// Se define el puerto en el que el servidor estará escuchando las solicitudes entrantes.
const PORT = 8000



//
// inicio  Cors  ...............

//Cors: whitelist (lista blanca de servidores que pueden acceder). 
//const whiteList = ['http://127.0.0.1:5500']


//Permitir todas las rutas:  app.use(cors())

//Se declara un objeto corsOptions para contener la configuración personalizada de CORS.
// establece una función para determinar si una solicitud CORS debe ser permitida o denegada en función del origen de la solicitud.
// Cors: whitelist (lista blanca de servidores que pueden acceder). 
const corsOptions = {
  //solo las rutas que esten dentro de origin se va a poder conectar
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'UPDATE', 'DELETE']
}

// Se aplica el middleware CORS con opciones personalizadas.
app.use(cors(corsOptions))
//ruta para verificar el funcionamiento de cors
// Defino una ruta GET llamada '/bienvenida'
app.get('/bienvenida', (req, res) => {
  // Cuando se haga una solicitud GET a '/bienvenida', se ejecuta esta función de devolución de llamada
  // req: representa la solicitud HTTP que llega al servidor
  // res: representa la respuesta HTTP que será enviada de vuelta al cliente
  // Configura el código de estado de la respuesta como 200 (OK) y envía un objeto JSON como respuesta
  res.status(200).send({ mensaje: "Bienvenidos a Gerhard" })
})

// fin  Cors  ...............







// inicio  Server  ...............

// Se inicia el servidor utilizando la instancia de Express 'app' y se especifica que escuche en el puerto definido por la variable 'PORT'.
const SERVER = app.listen(PORT, () => {
  // Cuando el servidor se inicia correctamente, se ejecuta esta función de devolución de llamada

  // Se imprime un mensaje en la consola indicando que el servidor se ha iniciado correctamente y en qué puerto está escuchando.
  console.log(`Server on port ${PORT}`);
});


//declaro un nuevo servidor de sockets.io
const io = new Server(SERVER)

// fin Server  ...............




// inicio MongoDB Connection  ...............

//Proceso de conexión a MongoDB: la configuración de la contraseña, la gestión de la conexión exitosa y la captura de errores en caso de fallo en la conexión.

//onsole.log("URI de conexión a MongoDB:", varenv.mongo_url); // Agregado para depurar

// Se utiliza la contraseña definida por el usuario.
mongoose.connect(varenv.mongo_url)
  // Cuando la conexión se establece correctamente, se muestra el mensaje "DB is connected".
  .then(() => console.log("DB is connected"))
  // En caso de error, se muestra el error.    
  .catch(error => console.error('Error al conectar a MongoDB:', error));

// fin MongoDB Connection  ...............



// inicio  MOCKS: entregar 100 productos ...............






//  MIDDLEWARES   *********



//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))

//COOKIES
//todas las generadas aqui se van a hacer con esta clave secreta
app.use(cookieParser(varenv.cookies_secret))

//LOGGER
// Se aplica el middleware 'addLogger' para registrar información sobre cada solicitud HTTP que llega al servidor.
// app.use(addLogger);
app.use(addLogger)




// inicio  Session  ...............

//Configuro que:
app.use(session({
  //voy a tener un valor secreto
  secret: varenv.session_secret,
  //voy a guardar cada vez que recargue
  resave: true,
  store: MongoStore.create({
    //misma url con la que me conecto a la base de datos
    mongoUrl: varenv.mongo_url,
    //ttl es el tiempo en el cual vive mi sesion. Yo lo defino. ej: 2hs, 3dias,etc
    //me va a prmitir ingresar sin que yo me loguee
    //El tiempo de vida esta en segundos. 60 minutos x 60 segundos = 1 hora
    ttl: 60 * 60
  }),
  //Fuerzo a q se guarde la sesion en el storage cuando reinicio y que se pueda almacenar cuando tengo una recarga.
  saveUninitialized: true
}))



//......CON ESTO CONFIGURO HANDLEBARS.....

app.engine('handlebars', engine())
//voy a trabajar con handlebars, esto implementa lo que me devuelve mi dependencia

app.set('view engine', 'handlebars')
//set es para setear un valor
//para las vistas de mi aplicacion voy a implementar handlebars

//CON ESTO INDICO DONDE SE ESTA UTILIZANDO
app.set('views', __dirname + '/views')
//las vistas de mi aplicacion se encuentran en __dirname es mi path →seria la carpeta src y lo concateno con la carpeta views








//******* Routes of PASSPORT**********

initializePassport()
//ejecuto la funcion
app.use(passport.initialize())
//iniciá todo lo que serian las estrategias de autentificacion
app.use(passport.session())
//generame lo que sería las sesiones

//TODO LO







//******* RUTA RAÍZ: Manejo de solicitudes**********

//establece que el middleware indexRouter manejará las solicitudes en la ruta raíz de la aplicación.
app.use('/', indexRouter)







//........Routes of COOKIES............

//setea, crea una cookie
//fecha de expiración: maxAge
//signed: true →FIRMA DE COOKIE
app.get('/setCookie', (req, res) => {
  res.cookie('CookieCookie', 'Esto es una cookie :)', { maxAge: 3000000, signed: true }).send("Cookie creada")
})

//Consultar las cookies de mi aplicacion
app.get('/getCookie', (req, res) => {
  //signedCookies: consulto solo por cookies firmadas. SEGURIDAD GARANTIZADA
  res.send(req.signedCookies)
})

//Eliminar cookies
app.get('/deleteCookie', (req, res) => {
  res.clearCookie('CookieCookie').send("Cookie eliminada")
  //res.cookie('CookieCokie', '', { expires: new Date(0) })
});






//........Routes of SESSION............

//ruta para guardar una sesion del usuario
//esta es una forma de guardar un contador de usuarios.
//Consulto: si existe la sesion del usuario consulto por el valor sino la creo con el valor de 1
app.get('/session', (req, res) => {
  console.log(req.session)
  if (req.session.counter) {
    //genero atributo counter: va a contar la cantidad de veces que ingreso mi usuario a esta ruta
    //si ya habias entrado antes lo incremento en 1
    req.session.counter++;
    res.send(`Visitaste el sitio ${req.session.counter} veces.`)
  } else {
    //sos el primer usuario que ingresa
    req.session.counter = 1
    res.send("Bienvenido!")
  }
})


//ruta para loguear usuarios.................

app.post('/login', (req, res) => {
  //consulto email y contraseña
  const { email, password } = req.body
  //Simulacion que tengo una Base de datos como tal.
  if (email == "decoracion@gmail.com" && password == "265444") {
    //si se cumple me pude loguear
    //entonces guardo la session en mi servidor estos valores:
    req.session.email = email
    req.session.password = password
    console.log(req.session)
    return res.send("Login ok")
  }
  // si no cumple con estas condiciones
  res.send("Login invalido")
})



//...........SOCKET.IO..................

// Cuando se establece una conexión con Socket.io, se ejecuta esta función.
// Esta función recibe un socket que representa la conexión con el cliente.
io.on('connection', (socket) => {
  // Se imprime un mensaje en la consola del servidor para indicar la conexión exitosa.
  console.log("Conexión establecida con Socket.io")

  // Cuando el cliente envía un mensaje de 'mensaje', se ejecuta esta función.
  socket.on('mensaje', async (mensaje) => {
    // Se intenta almacenar el mensaje en la base de datos.
    try {
      // Se utiliza un modelo de mensaje (messageModel) para crear un nuevo mensaje en la base de datos.
      await messageModel.create(mensaje)
      // Busca todos los mensajes en la base de datos utilizando el modelo de mensaje (messageModel) y los almacena en la variable 'mensajes'
      const mensajes = await messageModel.find()
      // Se emite el evento 'mensajeLogs' a todos los clientes conectados, enviando el arreglo actualizado de mensajes.
      io.emit('mensajeLogs', mensajes)
    } catch (e) {
      // Si ocurre un error al almacenar el mensaje, se emite el error a todos los clientes conectados.
      io.emit('mensajeLogs', e)
    }
  })
})

//RUTA DE PRUEBA EN POSTMAN: localhost:8000/mockingproducts

// Endpoint '/mockingproducts' manejado por el controlador
app.get('/mockingproducts', (req, res) => {
  const products = generateRandomProducts();
  // Imprimir los productos en la consola
  console.log(products);    
  // Enviar los productos como respuesta JSON
  res.json(products);
});

// fin MOCKS: entregar 100 productos  ...............






//RUTA DE PRUEBA EN POSTMAN: localhost:8000/mockingproducts

// Endpoint '/mockingproducts' manejado por el controlador
app.get('/mockingusers', (req, res) => {
  const users = generateRandomUsers();
  // Imprimir los productos en la consola
  console.log(users);    
  // Enviar los productos como respuesta JSON
  res.json(users);
});

// fin MOCKS: entregar 100 productos  ...............