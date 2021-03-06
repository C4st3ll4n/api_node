import {AccountModel, AddAccount, AddAccountModel, EmailValidator} from "./signup-protocols";
import {SignUpController} from "./signup";
import {MissingParamError, InvalidParamError, ServerError} from "../../errors";

interface SutTypes {
    sut: SignUpController,
    emailValidator: EmailValidator,
    addAccount: AddAccount
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            const accountFake = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password'
            }
            return new Promise(resolve => resolve(accountFake))
        }
    }

    return new AddAccountStub()
}
const makeEmailValidator = (): EmailValidator => {

    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidator = makeEmailValidator()
    const addAccount = makeAddAccount()
    const sut = new SignUpController(emailValidator, addAccount)
    return {sut, emailValidator, addAccount}
}

describe('SignUp Controller', () => {
        test('Should return 400 if no name is provided', async() => {
            const {sut} = makeSut()
            const httpRequest = {
                body: {
                    email: "any_email@email.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(400)
            expect(httpResponse.body).toEqual(new MissingParamError("name"))
        })

        test('Should return 400 if no email is provided', async() => {
            const {sut} = makeSut()
            const httpRequest = {
                body: {
                    name: "any_name",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(400)
            expect(httpResponse.body).toEqual(new MissingParamError("email"))
        })

        test('Should return 400 if no passwords is provided', async() => {
            const {sut} = makeSut()
            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    passwordConfirmation: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(400)
            expect(httpResponse.body).toEqual(new MissingParamError("password"))
        })

        test('Should return 400 if no password confirmation is provided', async() => {
            const {sut} = makeSut()
            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(400)
            expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"))
        })

        test('Should return 400 if passworConfirmation fails', async() => {
            const {sut} = makeSut()
            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                    passwordConfirmation: "invalid_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(400)
            expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"))
        })

        test('Should return 400 if an invalid email is provided', async() => {
            const {sut, emailValidator} = makeSut()
            jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "invalid_email",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(400)
            expect(httpResponse.body).toEqual(new InvalidParamError("email"))
        })

        test('Should call EmailValidator with correct email', async() => {
            const {sut, emailValidator} = makeSut()
            const isValidSpy = jest.spyOn(emailValidator, 'isValid')

            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }
            sut.handle(httpRequest)
            expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
        })

        test('Should return 500 if EmailValidator throws', async() => {
            const {sut, emailValidator} = makeSut()

            jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
                throw new Error()
            })

            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(500)
            expect(httpResponse.body).toEqual(new ServerError())
        })

        test('Should call AddAcount with correct values', async() => {
            const {sut, addAccount} = makeSut()
            const addSpy = jest.spyOn(addAccount, 'add')

            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }

            sut.handle(httpRequest)
            expect(addSpy).toHaveBeenCalledWith({
                name: "any_name",
                email: "any_email@email.com",
                password: "any_password",
            })
        })

        test('Should return 500 if AddAccount throws', async() => {
            const {sut, addAccount} = makeSut()

            jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
                return new Promise((resolve, reject) => reject(new Error()))
            })

            const httpRequest = {
                body: {
                    name: "any_name",
                    email: "any_email@email.com",
                    password: "any_password",
                    passwordConfirmation: "any_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(500)
            expect(httpResponse.body).toEqual(new ServerError())
        })

        test('Should return 200 when valid data is provided', async() => {
            const {sut} = makeSut()
            const httpRequest = {
                body: {
                    name: "valid_name",
                    email: "valid_email@email.com",
                    password: "valid_password",
                    passwordConfirmation: "valid_password",
                }
            }
            const httpResponse = await sut.handle(httpRequest)
            expect(httpResponse.statusCode).toBe(200)
            expect(httpResponse.body).toEqual({
                id: 'valid_id',
                name: "valid_name",
                email: "valid_email@email.com",
                password: "valid_password",
            })
        })

    }
)


/*
describe('', () => {
        test('', () => {

        })
    }
)
 */