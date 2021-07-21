import {EmailValidatorAdapter} from "./email-validator-adapter";
import validator from "validator";
import isEmail = validator.isEmail;

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true;
    }
}))

const makeSut = ():EmailValidatorAdapter => {
    return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
    test('Should return false when validator return false', () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const sut = makeSut()
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(false)
    })

    test('Should return true when validator return true', () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid_email@email.com')
        expect(isValid).toBe(true)
    })

    test('Should call validator with correct email', () => {
        const isEmailSpy = jest.spyOn(validator, 'isEmail')

        const sut = makeSut()
        sut.isValid('any_email@email.com')

        expect(isEmailSpy).toHaveBeenCalledWith("any_email@email.com")
    })


})