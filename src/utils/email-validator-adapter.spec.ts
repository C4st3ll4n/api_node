import {EmailValidatorAdapter} from "./email-validator";


describe('EmailValidator Adapter',()=>{
    test('Should return false when validator return false', ()=>{
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_email@email.com')
        expect(isValid).toBe(false)
    })
})