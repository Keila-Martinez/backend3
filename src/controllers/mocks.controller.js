import { petsService, usersService } from "../services/index.js";
import MockingService from "../services/mocking.js";

const getMockingPets = async (req, res) => {
    const pets = await MockingService.generateMockingPets(100); 
    res.send({status: "success", payload: pets}); 
}

const getMockingUsers = async (req, res) => {
    const users = await MockingService.generateMockingUsers(50);
    res.send({status: "success", payload: users}); 
}

const generateData = async (req, res) => {
    const { users, pets } = req.body; 
    try {
        //Generamos los usuarios falsos: 
        const mockingUsers = await MockingService.generateMockingUsers(users);

        //Generamos las mascotas falsas: 
        const mockingPets = await MockingService.generateMockingPets(pets);

        //Insertamos los datos nuevas en la BD: 
        await Promise.all(
            mockingUsers.map(user => usersService.create(user)),
            mockingPets.map(pet => petsService.create(pet))
        );
        
        res.send({
            status: "success",
            message: "Todo salio bien amiguitoooooo"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fatal, se suspende el fin de semana"); 
    }
}

export default {
    getMockingPets,
    getMockingUsers,
    generateData
}