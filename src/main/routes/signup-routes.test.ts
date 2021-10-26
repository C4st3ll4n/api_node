import request from "supertest"
import app from '../config/app'
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";


beforeAll(
    async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    }
)

afterAll(async () => {
    await MongoHelper.disconnect();
})

beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
})


describe('Signup routes', function () {
    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name:"Pedro",
                email:"pedro@gmail.com",
                password:"p3dr0p3dr0",
                passwordConfirmation:"p3dr0p3dr0"
            })
            .expect(200)
    })
});
