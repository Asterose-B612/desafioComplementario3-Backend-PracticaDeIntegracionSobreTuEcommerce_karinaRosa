import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: "decodikiaro@gmail.com",
        pass: ""
    }
})
// Esta función asincrónica envía un correo electrónico para restablecer la contraseña.
//solicito por parametro el email del usuario
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
    }

    // Envia el correo electrónico usando el objeto "transporter" previamente configurado.
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log("Error al enviar correo")
        } else {
            console.log("Correo enviado correctamente", info.response)
        }
    })
}