const { Router } = require("express");
const router = Router();
const { Products } = require("../db");
const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, './Data.json');

async function loadProductsFromJSON() {
    try {
        // Leer el archivo JSON
        const data = fs.readFileSync(jsonFilePath, 'utf-8');

        // Parsear el contenido del archivo JSON
        const products = JSON.parse(data);

        // Insertar cada producto en la base de datos
        const createdProducts = await Promise.all(products.map(async (product) => {
            try {
                return await Products.create(product);
            } catch (error) {
                console.error('Error al insertar producto:', error);
            }
        }));

        console.log('Los productos se han cargado correctamente en la base de datos.');
        
        return createdProducts;
    } catch (error) {
        console.error('Error al cargar los productos desde el archivo JSON:', error);
        throw new Error('Hubo un problema al cargar los productos desde el archivo JSON');
    }
}

router.use(async (req, res, next) => {
    try {
        const productsCount = await Products.count();

        // Si la base de datos está vacía, cargar los productos desde el archivo JSON
        if (productsCount === 0) {
            await loadProductsFromJSON();
        }
        
        next();
    } catch (error) {
        console.error('Error al verificar si la base de datos está vacía:', error);
        res.status(500).json({ error: 'Hubo un problema al verificar si la base de datos está vacía' });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Products.findAll();

        if (products.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos' });
        }

        res.json(products);
    } catch (error) {
        console.error('Error al obtener o insertar los productos:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener o insertar los productos' });
    }
});


router.post('/createProduct', async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            // Si solo se envía un objeto JSON, crear un solo producto
            let { Handle, Title, Description, SKU, Grams, Stock, Price, ComparePrice, Barcode } = req.body;
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
            return res.status(201).json(newProduct);
        } else {
            // Si se envía un array de objetos JSON, crear varios productos
            const createdProducts = await Promise.all(req.body.map(async (product) => {
                return await Products.create(product);
            }));
            // Enviar los nuevos productos creados como respuesta
            res.status(201).json(createdProducts);
        }
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Hubo un problema al crear el producto' });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const productId = req.params.id; 
        const { Handle, Title, Description, SKU, Grams, Stock, Price, ComparePrice, Barcode } = req.body;
     
        const product = await Products.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'El producto no fue encontrado' });
        }
        
        await product.update({
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
 
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Hubo un problema al actualizar el producto' });
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const productId = req.params.id; 
        const product = await Products.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'El producto no fue encontrado' });
        }
        
        await product.destroy();

        res.status(200).json({ message: 'El producto fue eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Hubo un problema al eliminar el producto' });
    }
});


module.exports = router;
