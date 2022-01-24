import {Collection, MongoClient} from "mongodb";

export const MongoHelper = {
    client: null as MongoClient,
    uri: null as String,

    async connect(url: string): Promise<void> {
        this.uri = url
        this.client = await MongoClient.connect(url)
    },

    async disconnect(): Promise<void> {
        await this.client.close();
        this.client = null
    },

    async getCollection(name: String): Promise<Collection> {
        if (!this.client || !this.client.isConnected) {
            await this.connect(this.uri)
        }
        return this.client.db().collection(name);
    },

    map: (collection: any, insertedId: any): any =>
        (Object.assign({}, collection,
            {id: insertedId.toHexString()}))

}
