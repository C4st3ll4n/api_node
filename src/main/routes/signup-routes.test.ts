import request from "supertest"
import app from '../config/app'

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
