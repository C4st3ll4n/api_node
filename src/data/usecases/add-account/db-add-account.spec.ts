import {DbAddAccount} from "./db-add.account";
import {AccountModel, AddAccountModel, Encrypter, AddAccountRepository} from "./db-add-account-protocols";

interface SutTypes {
    addAccount: DbAddAccount
    encrypter: Encrypter
    addAccountRepository: AddAccountRepository
}

const makeAddAccountRepository = () : AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository{
        async add(account:AddAccountModel): Promise<AccountModel>{
            const fakeAccount = {
                id:'valid_id',
                name:'valid_name',
                email:'valid_email@email.com',
                password:'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {

    class EncrypterStub implements Encrypter{
        async encrypt(password: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub();
}

const makeSut = (): SutTypes => {

    const encrypter = makeEncrypter()
    const addAccountRepository = makeAddAccountRepository()
    const addAccount = new DbAddAccount(encrypter, addAccountRepository)

    return {
        addAccount, encrypter, addAccountRepository
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

    test("Should call add account repository with correct values", async () => {

        const {addAccount, addAccountRepository} = makeSut()
        const addSpy = jest.spyOn(addAccountRepository, 'add')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        await addAccount.add(accountData)

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        })
    })
})