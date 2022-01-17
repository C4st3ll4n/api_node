import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {DbAddAccount} from "../../data/usecases/add-account/db-add.account";
import {BcryptAdapter} from "../../infra/criptography/bcrypt-adapter";
import {AccountMongoRepository} from "../../infra/db/mongodb/account_repository/account";

export const makeSignupController = (): SignUpController => {
    const emailValidator = new EmailValidatorAdapter();
    const encrypter = new BcryptAdapter(12);
    const addAccountRepository = new AccountMongoRepository();
    const addAccount = new DbAddAccount(encrypter, addAccountRepository);
    return new SignUpController(emailValidator, addAccount);
}
