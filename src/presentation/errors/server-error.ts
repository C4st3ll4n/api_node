export class ServerError extends Error{
    constructor() {
        super('An internal error occured');
        this.name = "ServerError"
    }
}