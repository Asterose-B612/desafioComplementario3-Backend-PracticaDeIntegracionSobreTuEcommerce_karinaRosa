import varenv from '../../dotenv.js'
/*importa dos objetos, Strategy y ExtractJwt, desde el módulo "passport-jwt". Estos objetos son utilizados  para implementar una estrategia de autenticación basada en JSON Web Tokens (JWT) en una aplicación web utilizando la biblioteca Passport.js en Node.js.*/
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../../models/user.js";

// Definición de la función cookieExtractor que toma un objeto req (presumiblemente una solicitud HTTP) como argumento
const cookieExtractor = req => {
    // Imprime en la consola el objeto cookies de la solicitud req para propósitos de depuración o comprensión
    console.log(req.cookies) 
       // Verifica si req.cookies existe
    // Si existe, asigna el valor de req.cookies.jwtCookie a la variable token
    // Si no existe, asigna un objeto vacío {} a token
    const token = req.cookies ? req.cookies.jwtCookie : {}
        // Imprime en la consola el contenido de token
    console.log(token)
      // Retorna el valor de token
    return token
}


//console.log(varenv.jwt_secret)
/*****STRATEGY OF JWT***** */

//1° Defino, Donde voy a consultar esos valores?
//Lo voy a hacer de las cookies

const jwtOptions = {
    //Este token →jwtFromRequest lo voy a consultar de el archivo llamado ExtractJwt donde yo digo de donde lo voy a traer el token. Puedo extraerlo del query, header, del mismo archivo o de la forma mas común que es del headerAsBeaererToken
    //aqui lo extraigo desde el header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() esperar el token de JWT desde la peticion
    //jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]) consultando desde las cookies
    secretOrKey: varenv.jwt_secret
}



// Importa la estrategia JwtStrategy desde la librería passport-jwt y la asigna a una constante llamada strategyJWT
export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
       // La función de callback es asíncrona ya que se va a realizar una consulta a la base de datos
        //payload va a contener toda la info referida al usuario
    //done es para retornar directamente por el correcto o incorrecto.
    try {
        // Imprime en la consola el payload del token JWT recibido
        console.log(payload);
        // Utiliza el modelo userModel para buscar en la base de datos un usuario con el ID especificado en el payload del token
        //es un objeto dentro de un objeto
        const user = await userModel.findById(payload.user._id);        
        // Imprime en la consola el usuario encontrado en la base de datos
        console.log(user);
        // Si no se encontró ningún usuario en la base de datos, llama a done() con null como error y false como segundo argumento para indicar que la autenticación ha fallado
        if (!user) {
            //porque no me pude loguear
            return done(null, false);
        }
        // Si se encontró el usuario en la base de datos, llama a done() con null como error y el objeto usuario como segundo argumento para indicar que la autenticación ha sido exitosa
        return done(null, user);
    } catch (e) {
        // Si ocurre algún error durante la consulta a la base de datos, llama a done() con el error como primer argumento y null como segundo argumento para indicar que la autenticación ha fallado
        //error: este usuario no se logueo
        return done(e, null);
    }
});
/*ES IDENTICO AL LOGUIN (ver en pssport.js)*/