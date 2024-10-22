import { Router } from "express";
const router = Router(); 

//Importamos el controlador: 
import mocksController from "../controllers/mocks.controller.js";

//Crear la ruta para obtener mascotas: 
router.get("/mockingpets", mocksController.getMockingPets); 

//Crear la ruta para obtener usuarios: 
router.get("/mockingusers", mocksController.getMockingUsers); 

//Crear una ruta que reciba dos parametros numericos (usuarios y mascotas) e insertarlos en la base de datos. 
router.post("/generatedata", mocksController.generateData); 

export default router; 