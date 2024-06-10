import { Router } from "express";
import passport from "passport";
import { login, register, sessionGithub,current, logout, testJWT, sendEmailPassword } from "../controllers/sessionController.js";



// Crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.
const sessionRouter = Router();



// inicio INICIO DE SESION....................

sessionRouter.get('/login', passport.authenticate('login'), login)

//fin INICIO DE SESION....................






// inicio REGISTRO....................

sessionRouter.post('/register', passport.authenticate('register'), register)

// fin REGISTRO....................





// inicio RUTA GITHUB....................

// Ruta GET para la autenticación de GitHub de mi usuario, que utiliza Passport.js para iniciar la autenticación utilizando la estrategia 'github' configurada previamente.

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {  })
//el scope de mi aplicacion, es la devolucion del email (user:email). Cuando hago referencia a mi usuario, hago referencia a mi email.
//El usuario en Github va a ser mi email

//LA ANTERIOR ME VA A REDIRECCIONAR AUTOMATICAMENTE A LA SIGUIENTE RUTA CUANDO MI USUARIO SE LOGUEA CORRECTAMENTE
// Ruta GET para manejar la devolución de llamada de autenticación de GitHub, utilizada después de que el usuario haya autorizado la aplicación en GitHub.
//nombre de la estrategis ('github')
sessionRouter.get('/githubSession', passport.authenticate('github'),sessionGithub)

// fin RUTA GITHUB....................






// inicio RUTA CURRENT....................
//consulto si el usuario se logueo correctamente o no
//verifico que esta autenticado con jwt

sessionRouter.get('/current', passport.authenticate('jwt'), current)

// fin RUTA CURRENT....................





// inicio LOGOUT (desloguearse: cerrar sesion)....................

//Definición de la ruta GET '/logout' en el enrutador de sesiones.
sessionRouter.get('/logout', logout);

// fin LOGOUT....................






// inicio RUTA JWT....................

//Configuración de la ruta '/testJWT' en el enrutador 'sessionRouter' para probar la autenticación JWT
//session: fale porque no quiero generar una sesion como tal sino solo testear.
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), testJWT)

// fin RUTA JWT....................






// inicio REESTABLECER CONTRASEÑA....................

//Configuración de la ruta '/changePassword' en el enrutador 'sessionRouter' para reestablecer contraseña
//passport.authenticate('jwt', { session: false }) NO LO USAMOS PORQUE SI SOY UN USUARIO QUE PERDIÓ LA CONTRASEÑA NO ESTOY LOGUEADO, No tengo que estar logueado xq si ya estoy logueado no cambia la contraseña.
//es un método ´post  porque tengo que enviar el email
sessionRouter.post('/sendEmailPassword', sendEmailPassword)




sessionRouter.post('/reset-password/:token', changePassword)




// fin REESTABLECER CONTRASEÑA....................



export default sessionRouter;
