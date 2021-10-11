import {AddAccountRepository} from "../../../../data/protocols/add-account-repository";
import {AddAccountModel} from "../../../../domain/usecases/add-account";
import {AccountModel} from "../../../../domain/models/account";
import {MongoHelper} from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {

    async add(account: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection("accounts")
        const result = await accountCollection.insertOne(account)

        const createdAccount = Object.assign({}, await accountCollection.findOne({_id: result.insertedId}),
            {id: result.insertedId.toHexString()}) as AccountModel

        return Promise.resolve(createdAccount);
    }

}
