import Client from './client';
import ModuleFactory from './module-factory';
import ClientProxy from './client-proxy';

class ClientModuleFactory extends ModuleFactory {
    constructor(gameServer) {
        super();
        this.gameServer = gameServer;
        this.collections = gameServer.collections;
    }

    createClient(cli) {
        const client = new Client();
        client.ID = cli.ID;
        this.collections('game').push('client', {
            serverID: this.gameServer.ID,
            clientID: client.ID,
            client
        });
        return client;
    }

    get(cli) {
        const client = this.createClient(cli);
        const proxy = ClientProxy(client, this);
        return proxy;
    }
}

export default ClientModuleFactory;