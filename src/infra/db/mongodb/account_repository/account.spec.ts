describe("Account Repository", () => {
    test("ensure return an account on sucess", () => {
        const sut = new AccountMongoRepository()
        sut.add({
            name:"any_name",
            email:"any_email@email.com",
            password:"any_password"
        })
    })
})