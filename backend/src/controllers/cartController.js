// Importa el modelo 'cartModel' desde el archivo '../models/cart.js'
import cartModel from "../models/cart.js";
// Importa el modelo 'productModel' desde el archivo '../models/product.js'
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";



//*******inicio OBTENER UN CARRITO POR SU ID******************

// Función asíncrona para obtener un carrito por su ID
export const getCart = async (req, res) => {
    try {
        // Obtiene el ID del carrito desde los parámetros de la solicitud
        const cartId = req.params.cid;
        // Busca un carrito en la base de datos por su ID
        const cart = await cartModel.findOne({ _id: cartId });
        // Envía el carrito encontrado como respuesta al cliente con un código de estado 200 (OK)
        res.status(200).send(cart);
    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
}

//*******fin OBTENER UN CARRITO POR SU ID******************





//  inicio CREAR CARRITO VACÍO******************

// Función asíncrona para crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        // Crea un nuevo carrito con un array de productos vacío
        const mensaje = await cartModel.create({ products: [] });
        // Envía un mensaje de confirmación al cliente con un código de estado 201 (Created)
        res.status(201).send(mensaje);
    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`);
    }
}

//  fin CREAR CARRITO VACÍO******************





// inicio INSERTAR PRODUCTO EN CARRITO***********

// Función asíncrona para insertar un producto en un carrito
export const insertProductCart = async (req, res) => {
    try {
        // Verifica si el usuario tiene permisos de 'User'
        if (req.user.rol == "User") {
            // Obtiene el ID del carrito y el ID del producto desde los parámetros de la solicitud
            const cartId = req.params.cid;
            const productId = req.params.pid;
            // Obtiene la cantidad del producto desde el cuerpo de la solicitud
            const { quantity } = req.body;
            // Busca el carrito en la base de datos por su ID
            const cart = await cartModel.findById(cartId);

            // Encuentra el índice del producto en el carrito
            const indice = cart.products.findIndex(product => product.id_prod == productId);

            // Si el producto ya está en el carrito, actualiza la cantidad
            if (indice != -1) {
                cart.products[indice].quantity = quantity;
            } else {
                // Si el producto no está en el carrito, lo añade con la cantidad especificada
                cart.products.push({ id_prod: productId, quantity: quantity });
            }
            // Actualiza el carrito en la base de datos con los cambios realizados
            const mensaje = await cartModel.findByIdAndUpdate(cartId, cart);
            // Envía un mensaje de confirmación al cliente con un código de estado 200 (OK)
            res.status(200).send(mensaje);
        } else {
            // Si el usuario no tiene permisos de 'User', envía un mensaje de error al cliente con un código de estado 403 (Forbidden)
            res.status(403).send("Usuario no autorizado");
        }

    } catch (error) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`);
    }
}

// fin INSERTAR PRODUCTO EN CARRITO***********




// inicio CREAR TICKET DE COMPRA***********

// Función asíncrona para crear un ticket de compra
export const createTicket = async (req, res) => {
    try {
        // Obtiene el ID del carrito desde los parámetros de la solicitud
        const cartId = req.params.cid;
        // Busca el carrito en la base de datos por su ID
        const cart = await cartModel.findById(cartId);
        // Inicializa un array para almacenar los productos sin stock
        const prodSinStock = [];
        // Verifica si el carrito existe
        if (cart) {
            // Itera sobre los productos del carrito
            cart.products.forEach(async (prod) => {
                // Busca el producto en la base de datos por su ID
                let producto = await productModel.findById(prod.id_prod);
                // Verifica si hay suficiente stock del producto en el inventario
                if (producto.stock - prod.quantity < 0) {
                    // Si no hay suficiente stock, agrega el producto a la lista de productos sin stock
                    prodSinStock.push(producto);
                }
            });
            // Si no hay productos sin stock, finaliza la compra
            if (prodSinStock.length == 0) {
                // Calcula el precio total de los productos en el carrito
                // reduce() recorre el array de productos y acumula el resultado de la multiplicación del precio y la cantidad de cada producto
                const totalPrice = cart.products.reduce((a, b) => (a.price * a.quantity) + (b.price * b.quantity), 0);

                // Genera un nuevo ticket
                const newTicket = await ticketModel.create({
                    // code: genera un identificador único para el ticket usando la función randomUUID() de crypto
                    code: crypto.randomUUID(),
                    // purchaser: almacena el correo electrónico del usuario que realiza la compra, obtenido de req.user.email
                    purchaser: req.user.email,
                    // amount: asigna el totalPrice calculado anteriormente como el monto total del ticket
                    amount: totalPrice,
                    // products: incluye el array de productos del carrito en el ticket
                    products: cart.products
                });

                //VACIARcarrito


                // Responde al cliente con el nuevo ticket y un código de estado 200 (OK)
                res.status(200).send(newTicket);
            } else {
                // Si hay productos sin stock, retorna la lista de productos sin stock al cliente
                
                //RETORNAN PRODUCTOS SIN STOCK
            }
        } else {
            // Si el carrito no existe, envía un mensaje de error al cliente con un código de estado 404 (Not Found)
            res.status(404).send("Carrito no existe");
        }
    } catch (e) {
        // Si ocurre un error, envía un mensaje de error al cliente con un código de estado 500 (Internal Server Error)
        res.status(500).send(e);
    }
}
// fin CREAR TICKET DE COMPRA***********