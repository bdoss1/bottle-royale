import GameEvents from './game-events';
import ModuleFactory from './module-provider';
import GameEventsProxy from './game-events-proxy';
import { GameService } from '../../services/game-service';

class GameEventsFactory extends ModuleFactory {
    constructor(collections) {
        super();
        this.collections = collections;
    }

    createGameEvents(client) {
        const gevents = new GameEvents(client);
        gevents.ID = this.collections('game').uid('game.game_events');
        this.collections('game').push('game_events', {
            serverID: GameService.serverID,
            clientID: client.ID,
            gameEventsID: gevents.ID,
            gevents
        });
        return gevents;
    }

    get(client) {
        const storm = GameEventsProxy(client, this);

        return storm;
    }
}

export default GameEventsFactory;