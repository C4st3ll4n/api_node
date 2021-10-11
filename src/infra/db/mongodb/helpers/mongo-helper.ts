import {Collection, MongoClient} from "mongodb";
import {AccountModel} from "../../../../domain/models/account";

export const MongoHelper = {
    client: null as MongoClient,

    async connect(url: String): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL, {})
    },

    async disconnect(): Promise<void> {
        await this.client.close();
    },

    getCollection(name: String): Collection {
        return this.client.db().collection(name);
    },

    map: (collection: any, insertedId: any): any =>
        (Object.assign({}, collection,
            {id: insertedId.toHexString()}))

}
