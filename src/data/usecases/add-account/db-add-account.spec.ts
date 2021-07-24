import {DbAddAccount} from "./db-add.account";
import {Encrypter} from "./db-add-account-protocols";

interface SutTypes {
    addAccount:DbAddAccount
    encrypter: Encrypter
}

const makeEncrypter = (): Encrypter => {

    class EncrypterStub {
        async encrypt(password: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub();
}

const makeSut = (): SutTypes => {

    const encrypter = makeEncrypter()
    const addAccount = new DbAddAccount(encrypter)

    return {
        addAccount, encrypter
    }

}
describe("DbAddAccount", () => {

    test("Should call encrypter with correct password", async () => {

        const {addAccount, encrypter} = makeSut()
        const encryptSpy = jest.spyOn(encrypter, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        await addAccount.add(accountData)

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test("Should throw when encrypter throws ", async () => {

        const {addAccount, encrypter} = makeSut()
        jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(new Promise(((resolve, reject) => reject(new Error()))))

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        const promise = addAccount.add(accountData)

        await expect(promise).rejects.toThrow()
    })
})