const axios = require("axios");
const fs = require('fs');
const path = require('path');
const { Router } = require("express");
const router = Router();
const { Users, Products } = require("../db");


router.get("/", async (req, res) => {
    try {
        // Leer el archivo JSON
        const jsonData = fs.readFileSync(path.resolve(__dirname, "../Data.json"), 'utf-8');
        const productsData = JSON.parse(jsonData);

        // Insertar datos en la base de datos
        await Products.bulkCreate(productsData);

        // Obtener todos los productos después de la inserción
        const allProducts = await Products.findAll();
        
        console.log(allProducts);
        res.json(allProducts);
    } catch (error) {
        console.error('Error al obtener o insertar los productos:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener o insertar los productos' });
    }
});


// const products = [
//     {
//       "Handle": "cola-glitter-23-grs",
//       "Title": "COLA GLITTER 23 GRS",
//       "Description": "<p><strong>Características:</strong></p> <ul> <li>Para hacer pegaduras, contornos, decorar y pintar sobre papel, papel cartón y cartulina.</li> <li>Posee un brillo intenso con glitter.</li> <li>Lavable (no mancha las ropas).</li> </ul>",
//       "SKU": 60870131001,
//       "Grams": 100,
//       "Stock": 1013,
//       "Price": 1161,
//       "ComparePrice": 1290,
//       "Barcode": 7891153003689
//     },
//     // Agrega aquí los demás productos
//   ];
  
//   axios.post('http://localhost:3001/products/createProduct', products)
//     .then(response => {
//       console.log('Productos creados:', response.data);
//     })
//     .catch(error => {
//       console.error('Error al crear productos:', error);
//     });

router.post('/createProduct', async (req, res) => {
    try {
        // Obtener los datos del nuevo producto del cuerpo de la solicitud
        let { Handle, Title, Description, SKU, Grams, Stock, Price, ComparePrice, Barcode } = req.body;

        // Crear un nuevo registro de producto en la base de datos
        let newProduct = await Products.create({
            Handle,
            Title,
            Description,
            SKU,
            Grams,
            Stock,
            Price,
            ComparePrice,
            Barcode
        });
console.log(newProduct)
        // Enviar el nuevo producto creado como respuesta
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el producto' });
    }
});

// router.put('/update/:id', (req,res) => {

// })

// router.delete('/delete/:id', (req,res) => {

// })

module.exports = router;
