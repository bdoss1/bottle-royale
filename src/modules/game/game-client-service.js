import _ from 'lodash';
import GameClient from './game-client';
import GameCollections from './game-collections';
import GameBehavior from './game-behavior';
import GameService from '../../services/game-service';
import GamePlayer from './game-player';

class GameClientService {
    constructor(collection, eventService) {
        this.collections = collection;
        this.events = eventService;
        this.sandbox = {};
    }

    createClient(app) {
        const client = new GameClient();
        client.ID = this.collections('game.client_identity').uid();
        this.collections('runtime').push('client_app', {
            clientID: client.ID,
            app
        });
        return client;
    }

    createBehavior(client) {
        const behavior = new GameBehavior(client);
        behavior.ID = this.collections('game.client_behavior').uid();
        this.collections('runtime').push('client_behavior', {
            clientID: client.ID,
            behaviorID: behavior.ID,
            behavior
        });
        return behavior;
    }

    createPlayer(client) {
        const player = new GamePlayer(client, this.createBehavior(client));
        player.ID = this.collections('game.player').uid();
        this.collections('runtime').push('client_player', {
            playerID: player.ID,
            clientID: client.ID,
            player
        });
        return player;
    }

    connectClient(client, nickname) {
        
    }

    setupGameClients() {
        _.each(this.collections('runtime').kind('client_app'), client => {
            client.app.ready();
        });
    }

    bootstrapMatchmaking() {
        const readys = _.map(GameService.matchmaking.getReadyClients(), item => item.clientID);
        const matchmaking = {
            players: GameService.matchmaking.getPlayers()
        };
        const loads = this.collections('runtime').filter('client_app', app => readys.includes(app.clientID));
        const befors = this.events.filter('before_game_load', listener => readys.includes(listener.params.clientID));
        const afters = this.events.filter('after_game_load', listener => readys.includes(listener.params.clientID));

        _.each(befors, listener => {
            listener.callback(matchmaking);
        });
        _.each(loads, client => {
            client.app.load(matchmaking);
        });
        _.each(afters, listener => {
            listener.callback(matchmaking);
        });
    }
}

export default GameClientService;