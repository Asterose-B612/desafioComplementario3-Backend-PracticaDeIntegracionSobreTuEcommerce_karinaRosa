import nodemailer from "nodemailer";

// Configura el transporter de Nodemailer para enviar correos electrónicos a través de Gmail.
const transporter = nodemailer.createTransport({
    // Servicio de correo electrónico que se usará (Gmail en este caso).
    service: 'gmail',
    auth: {
        // Dirección de correo electrónico desde la que se enviarán los correos.
        user: varenv.email_user,
        // Contraseña del correo electrónico (se debe rellenar esto con la contraseña correcta o usar un token de aplicación).En este caso aplicamos el .env
        pass: varenv.email_pass
    }
})
// Esta función asincrónica envía un correo electrónico para restablecer la contraseña.
// Solicita por parámetro el email del usuario y el enlace para cambiar la contraseña.
export const sendEmailChangePassword = async (email, linkChangePassword) => {
    // Define las opciones del correo electrónico.
    const mailOption = {
        // Dirección de correo electrónico del remitente.
        from: "decodikiaro@gmail.com",
        // Dirección de correo electrónico del destinatario.
        to: email,
        // Asunto del correo electrónico.
        subject: "Reestablecimiento de contraseña",
        // Texto plano del correo electrónico.
        // text:
        //     `
        //  Haz click en el siguiente enlace para el reestablecimiento de tu contraseña: ${linkChangePassword}

        // `,
        // Formato HTML del correo electrónico.
        html:

            `
             <p>Haz click aquí para cambiar tu contraseña </p>
        
        <button> <a href=${linkChangePassword}>Cambiar Contraseña </a></button>  
        `
    };

    // Envia el correo electrónico usando el objeto "transporter" previamente configurado.
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            // Muestra un mensaje en la consola si ocurre un error al enviar el correo.
            console.log("Error al enviar correo")
        } else {
            // Muestra un mensaje en la consola si el correo se envía correctamente.
            console.log("Correo enviado correctamente", info.response)
        }
    });
}

/**El correo contacto.gerhard@gmail.com se utiliza como la dirección de remitente para enviar correos electrónicos de restablecimiento de contraseña a los usuarios. */