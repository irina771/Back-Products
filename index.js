const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Sincronizar los modelos con la base de datos
conn.sync({ force: true }).then(() => {
  server.listen(3001, () => {
    console.log('Escuchando en el puerto 3001');
    
  });
});
