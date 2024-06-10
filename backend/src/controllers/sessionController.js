// Importa el módulo 'passport' que se utiliza para la autenticación de usuarios.
//import passport from "passport";
import { userModel } from "../models/user.js";
import { sendEmailChangePassword } from "../utils/nodemailer.js";
import jwt from "jsonwebtoken";
import { validatePassword, createHash } from "../utils/bcrypt.js";


// inicio INICIO DE SESION : LOGUEO....................

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
//fin INICIO DE SESION : LOGUEO....................






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

//RUTA PARA CAMBIAR LA CONTRASEÑA

// // Función asíncrona para manejar la solicitud de cambio de contraseña cuando se hace clic en esta ruta.
export const changePassword = async (req, res) => {
    // Extraemos el token de los parámetros de la solicitud y la nueva contraseña del cuerpo de la solicitud
    const { token } = req.params
    const { newPassword } = req.body
    // console.log(token.substr(6,))


    try {
        // Verificamos el token JWT, quitando los primeros 6 caracteres y usando la clave "coder"
        const validateToken = jwt.verify(token.substr(6,), "coder")
        // Buscamos un usuario en la base de datos cuyo email coincida con el del token validado
        //usofinOne xq esta dentro de un array.
        const user = await userModel.findOne({ email: validateToken.userEmail })


        if (user) {
            //  console.log(newPassword)
            //console.log(user.password)
            //  console.log(user)
            // Si el usuario existe, verificamos que la nueva contraseña NO SEA IGUAL a la anterior

            if (!validatePassword(newPassword, user.password)) {
                // Si no es igual, generamos un hash de la nueva contraseña
                const hashPassword = createHash(newPassword)
                // Actualizamos la contraseña del usuario con el nuevo hash
                user.password = hashPassword
                // Guardamos los cambios en la base de datos
                const resultado = await userModel.findByIdAndUpdate(user._id, user)
                //console.log(resultado)
                // Enviamos una respuesta exitosa
                res.status(200).send("Contraseña modificada correctamente")
            } else {
                // SI las contraseñas SON IGUALES, enviamos un error
                res.status(400).send("La contraseña no puede ser identica a la anterior")
            }


        } else {
            // Si el USUARIO NO EXISTE, enviamos un error de "Usuario no encontrado"
            res.status(404).send("Usuario no encontrado")
        }


    } catch (e) {
        console.log(e)
        // Si el token ha expirado, enviamos un error específico
        if (e?.message == 'jwt expired') {
            //error 400 porque no es un error que rompe el servidor para poner 500
            res.status(400).send("Expiró el tiempo para cambio de contraseña. En breves momentos se le estará enviando un nuevo mail para el cambio de contraseña")
        } else {
            // Para otros errores, enviamos un error de servidor
            res.status(500).send("e");
        }
    }
};


//.....PIDO EL EMAIL AL USUARIO
// Función asíncrona para manejar la solicitud de cambio de contraseña cuando se hace clic en esta ruta.
export const sendEmailPassword = async (req, res) => {

    try {
        // Extraemos el email del cuerpo de la solicitud(body)
        const { email } = req.body
        // Buscamos un usuario en la base de datos cuyo email coincida con el proporcionado
        const user = await userModel.find({ email: email })

        if (user) {
            // Si el usuario existe, generamos un token JWT con el email del usuario y la clave codeSecret "coder"
            const token = jwt.sign({ userEmail: email }, "coder", { expiresIn: '1hs' })
            // Creamos un enlace para restablecer la contraseña que incluye el token
            const resetLink = `http://localhost:8000/api/session/reset-password?token=${token}`
            // Enviamos un email al usuario con el enlace para restablecer la contraseña
            sendEmailChangePassword(email, resetLink)
            // Enviamos una respuesta exitosa
            res.status(200).send("Email enviado correctamente");

        } else {
            // Si el usuario no existe, enviamos un error de "Usuario no existe"
            res.status(404).send("Usuario no existe");
        }

    } catch (e) {
        console.log(e)
        // Para cualquier otro error, enviamos un error de servidor
        res.status(500).send("e");
    }
}

// fin REESTABLECER CONTRASEÑA....................
