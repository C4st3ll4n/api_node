import {BcryptAdapter} from "./bcrypt-adapter";
import bcrypt from 'bcrypt'

jest.mock('bcrypt', ()=>({
    async hash (): Promise<String>{
        return Promise.resolve("hash")
    }
}))

interface SutTypes {
    sut: BcryptAdapter
}

const makeSut = (salt:number = 12): SutTypes => {
    const sut = new BcryptAdapter(salt)
    return {sut}
}
describe("BcrypterAdapter", () => {
    test("ensure adapter calls encrypt with correct value", async () => {
        const salt = 12
        const {sut} = makeSut(salt)
        const encryptSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt("valid_password")
        expect(encryptSpy).toHaveBeenCalledWith("valid_password", salt)
    })

    test("ensure return hash on success", async ()=>{
        const salt = 12
        const {sut} = makeSut(salt)
        const hash = await sut.encrypt('valid_password')
        expect(hash).toBe('hash')

    })
})