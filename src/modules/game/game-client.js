import _ from 'lodash';
import nanoid from 'nanoid';
import GameService from '../../services/game-service';

class GameClient {
    constructor() {
        this.longID = nanoid();
        this.nickname = null;
    }

    connect(nickname) {
        this.nickname = nickname;
    }

    on(event, callback) {
        GameService.clients.events.on(event, callback, { clientID: this.ID });
    }

    off(event) {
        GameService.clients.events.off(event);
    }

    log(str, additionnal) {
        console.log(`[${this.longID}] ${str}`, additionnal);
    }
}

export default GameClient;