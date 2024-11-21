import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

//Importamos el nuevo router de mocks: 
import mocksRouter from "./routes/mocks.router.js"; 

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://CuentaProfe01:124132@codercluster.vnfyqhe.mongodb.net/backend3?retryWrites=true&w=majority&appName=codercluster`)
app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use("/api/mocks", mocksRouter); 

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))


//1) Instalamos: npm install swagger-jsdoc swagger-ui-express

//swagger-jsdoc: nos deja escribir la configuracion en un archivo .yaml (tambien en json) y a partir de ahi se genera un apidoc. 

//swagger-ui-express: nos permitirá linkear una interfaz grafica para podes visualizar la documentación. 

//2) Importamos: 
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from "swagger-ui-express"; 

//3) Creamos un objeto de configuración: swaggerOptions 

const swaggerOptions = {
    definition: {
        openapi: "3.0.1", 
        info: {
            title: "Documentación de la App Adoptame",
            description: "App dedicada a encontrar familias para los perritos de la calle"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

//4) Conectamos Swagger a nuestro servidor de Express: 

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs)); 