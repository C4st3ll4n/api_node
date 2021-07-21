import {EmailValidatorAdapter} from "./email-validator";
import validator from "validator";
import isEmail = validator.isEmail;

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true;
    }
}))

describe('EmailValidator Adapter', () => {
    test('Should return false when validator return false', () => {
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(false)
    })

    test('Should return true when validator return true', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('valid_email@email.com')
        expect(isValid).toBe(true)
    })
})