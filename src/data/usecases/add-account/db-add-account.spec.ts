import {DbAddAccount} from "./db-add.account";

class EncrypterStub {
    async encrypt(password:string):Promise<string>{
        return new Promise(resolve => resolve('hashed_password'))
    }
}

describe("DbAddAccount", () => {

    test("Should call encrypter with correct password", async () => {

        const encrypterStub = new EncrypterStub()
        const sut = new DbAddAccount(encrypterStub)
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        await sut.add(accountData)

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})