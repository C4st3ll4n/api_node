describe('SignUp Controller', () => {
        test('Should return 400 if no name is provided', () => {
            const sut = new SignUpController()
            const httpRequest = {
                body:{
                    name:"any_name",
                    email:"any_email",
                    password:"any_password",
                }
            }
            sut.handle(httpRequest)
        })
    }
)


/*gi
describe('', () => {
        test('', () => {

        })
    }
)
 */