import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// Middleware para parsear el body de las peticiones
app.use(bodyParser.json());

// Ruta de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, mundo desde TypeScript!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
