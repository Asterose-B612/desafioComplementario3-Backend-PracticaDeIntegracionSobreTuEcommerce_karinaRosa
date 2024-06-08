// Importa el módulo 'passport' que se utiliza para la autenticación de usuarios.
import passport from "passport";
import { sendEmailChangePassword } from "../utils/nodemailer.js";



// inicio INICIO DE SESION....................

// Función asíncrona para el inicio de sesión de un usuario.
export const login = async (req, res) => {
    try {
        // Verifica si no hay usuario autenticado.
        if (!req.user) {
            // Si no hay usuario autenticado, devuelve un código de estado 401 (Unauthorized) con un mensaje de error.
            return res.status(401).send("Usuario o contraseña no válidos");
        }

        // Establece la información del usuario en la sesión.
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        // Envía una respuesta con un código de estado 200 (OK) indicando que el usuario se ha logueado correctamente.
        res.status(200).send("Usuario logueado correctamente");

    } catch (e) {
        // Si ocurre un error durante el inicio de sesión, envía un mensaje de error con un código de estado 500 (Internal Server Error).
        res.status(500).send("Error al loguear usuario");
    }
}
//fin INICIO DE SESION....................






// inicio CURRENT: verificación de logueo de usuario....................

// Función asíncrona para verificar si el usuario está autenticado utilizando la estrategia JWT.
export const current = async (req, res) => {
    try {
        // Verifica si hay un usuario autenticado.
        if (req.user) {
            console.log(req)
            // Si hay un usuario autenticado, envía una respuesta con un código de estado 200 (OK) indicando que el usuario está logueado.
            res.status(200).send("Usuario logueado");
        } else {
            // Si no hay un usuario autenticado, devuelve un código de estado 401 (Unauthorized) con un mensaje de error.
            res.status(401).send("Usuario no autenticado");
        }
    } catch (e) {
        // Si ocurre un error, envía un mensaje de error con un código de estado 500 (Internal Server Error).
        res.status(500).send("Error al verificar usuario actual");
    }
}

// fin CURRENT: verificación de usuario....................






// inicio REGISTRO....................

// Función asíncrona para registrar un nuevo usuario.
export const register = async (req, res) => {
    try {
        // Verifica si no hay usuario autenticado.
        if (!req.user) {
            // Si no hay usuario autenticado, devuelve un código de estado 400 (Bad Request) con un mensaje de error.
            return res.status(400).send("Usuario ya existente en la aplicación");
        }

        // Envía una respuesta con un código de estado 200 (OK) indicando que el usuario se ha creado correctamente.
        res.status(200).send("Usuario creado correctamente");

    } catch (e) {
        // Si ocurre un error durante el registro, envía un mensaje de error con un código de estado 500 (Internal Server Error).
        res.status(500).send("Error al registrar usuario");
    }
}

// fin REGISTRO....................







// inicio LOGOUT (desloguearse: cerrar sesion)....................

//Función asíncrona para cerrar sesión de un usuario.
export const logout = async (req, res) => {
    // Destruye la sesión del usuario.
    req.session.destroy(function (e) {
        if (e) {
            // Si hay un error al destruir la sesión, se imprime en la consola.
            console.log(e)
        } else {
            // Si se destruye la sesión correctamente, redirige al usuario a la página de inicio.
            res.status(200).redirect("/")
        }
    })
}

// fin LOGOUT....................






// inicio RUTA GITHUB....................

// Función asíncrona para manejar la sesión de GitHub.
export const sessionGithub = async (req, res) => {
    // Establece la información del usuario obtenida de GitHub en la sesión.
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    // Redirige al usuario a la página de inicio.
    res.redirect('/')
}

// fin RUTA GITHUB....................







// inicio RUTA JWT....................

// Función asíncrona para probar la autenticación JWT.
export const testJWT = async (req, res) => {
    console.log("Desde testJWT" + req.user)
    // Verifica si el usuario tiene permisos de 'User'.
    if (req.user.rol == 'User')
        // Si el usuario no tiene permisos de 'User', devuelve un código de estado 403 (Forbidden) con un mensaje de error.
        res.status(403).send("Usuario no autorizado");
    else
        // Si el usuario tiene permisos de 'User', devuelve la información del usuario con un código de estado 200 (OK).
        res.status(200).send(req.user);
}
// fin RUTA JWT....................









// inicio REESTABLECER CONTRASEÑA....................

// // Función asíncrona para manejar la solicitud de cambio de contraseña cuando se hace clic en esta ruta.
export const changePassword = async (req, res) => {
    const{email} = req.body//tomamos el email del body
    sendEmailChangePassword(email, "https://www.google.com/")
    //cuanda haga click en la ruta voy a consultar el email.
    // Imprime el correo electrónico del usuario en la consola
   // console.log(req.user.email)
    // Verifica si el usuario tiene permisos de 'premium'.
   // if (req.user.rol == 'premium')
        res.status(200).send("Tiene un 15% de descuento por ser usuario premium");  
}
// fin REESTABLECER CONTRASEÑA....................