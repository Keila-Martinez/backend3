import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de la web Adoptame", () => {
    describe("Testing de Mascotas: ", () => {
        it("Endpoint POST /api/pets debe crear una mascota", async () => {
            const TitiMock = {
                name: "Titi",
                specie: "Perro",
                birthDate: "2010-05-10",
            };

            const { statusCode, _body } = await requester.post("/api/pets").send(TitiMock);

            console.log("Status Code:", statusCode);
            console.log("Body:", _body);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("_id");
        });
    });

    describe("Testing de adopciones", () => {
        it("Endpoint GET /api/adoptions debe devolver todas las adopciones", async () => {
            const { statusCode, _body } = await requester.get("/api/adoptions");

            console.log("Status Code:", statusCode);
            console.log("Body:", _body);

            expect(statusCode).to.equal(200);
            expect(_body).to.have.property("payload");
            expect(_body.payload).to.be.an("array");
        });

        it("Endpoint GET /api/adoptions/:aid debe devolver una adopción específica", async () => {
            
            const adoptionId = "673ff0c13a10b9fa3e842519"
            const { statusCode, _body } = await requester.get(`/api/adoptions/${adoptionId}`);
            console.log("Response Body:", _body);

            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("_id", adoptionId);
            expect(_body.payload).to.have.property("owner");
            expect(_body.payload).to.have.property("pet");
        });

        it("Endpoint POST /api/adoptions/:uid/:pid debe crear una adopción", async () => {
            const userId = "67170c152a99dcd1aa849782"; // ID válido
            
            
             // Crear una nueva mascota
            const petMock = {
                name: "Mascota Nueva",
                specie: "Gato",
                birthDate: "2020-01-01",
            };
            const petResponse = await requester.post("/api/pets").send(petMock);
            const petId = petResponse._body.payload._id;

            // Verificar que la mascota está disponible
            expect(petResponse._body.payload.adopted).to.equal(false);

            const { statusCode, _body } = await requester.post(`/api/adoptions/${userId}/${petId}`);
            console.log("Response Body:", _body);

            expect(statusCode).to.equal(201);
            expect(_body.status).to.equal("success");
            expect(_body.payload).to.have.property("adoptionId");
            expect(_body.payload).to.have.property("owner", userId);
            expect(_body.payload).to.have.property("pet", petId);
        });
    });
});
