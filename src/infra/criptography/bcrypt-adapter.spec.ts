import {BcryptAdapter} from "./bcrypt-adapter";
import bcrypt from 'bcrypt'

interface SutTypes {
    sut: BcryptAdapter
}

const makeSut = (salt:number): SutTypes => {
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
})