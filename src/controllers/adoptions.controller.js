import { adoptionsService, petsService, usersService } from "../services/index.js"

const getAllAdoptions = async(req,res)=>{
    const result = await adoptionsService.getAll();
    res.send({status:"success",payload:result})
}

const getAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId });
        if (!adoption) {
            return res.status(404).send({ status: "error", error: "Adoption not found" });
        }
        // Convertimos `_id` a string antes de enviarlo
        const adoptionData = { ...adoption.toObject(), _id: adoption._id.toString() };

        res.send({ status: "success", payload: adoptionData }); // Enviamos `adoptionData`
    } catch (error) {
        console.error("Error en getAdoption:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};


const createAdoption = async (req, res) => {
    try {
        const { uid, pid } = req.params;

        // Verificar que el usuario existe
        const user = await usersService.getUserById(uid);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        // Verificar que la mascota existe
        const pet = await petsService.getBy({ _id: pid });
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });

        // Verificar que la mascota no esté adoptada
        if (pet.adopted) {
            return res.status(400).send({ status: "error", error: "Pet is already adopted" });
        }

        // Actualizar la mascota y el usuario
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets });
        await petsService.update(pet._id, { adopted: true, owner: user._id });

        // Crear la adopción y devolver su información
        const adoption = await adoptionsService.create({ owner: user._id, pet: pet._id });

        res.status(201).send({
            status: "success",
            message: "Pet adopted",
            payload: {
                adoptionId: adoption._id.toString(), // Convertir `_id` a string
                owner: user._id.toString(),
                pet: pet._id.toString(),
            },
        });
    } catch (error) {
        console.error("Error en createAdoption:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption,
};
