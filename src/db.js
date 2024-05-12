require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/products`,
  {
    logging: false,
    native: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });


const basename = path.basename(__filename);
const modelDefiners = [];

// Leer y agregar los modelos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach(file => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Agregar los modelos al objeto de Sequelize
modelDefiners.forEach(model => model(sequelize));

// Capitalizar los nombres de los modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(entry => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Definir las relaciones entre los modelos
const { Users, Products } = sequelize.models;
Users.belongsToMany(Products, { through: 'user_products' });
Products.belongsToMany(Users, { through: 'user_products' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
