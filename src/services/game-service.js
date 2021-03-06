import GameService from '../modules/game/game-service';
import GameCollections from '../modules/game/game-collections';
import ClientService from '../modules/game/client-service';
import MatchmakingService from '../modules/game/matchmacking-service';
import GameEngine from '../modules/game/game-engine';
import EventService from '../modules/game/event-service';
import RethinkDBPersistHandler from '../modules/io/rethinkdb-persist-handler';
import StormService from '../modules/game/storm-service';
import VehiculeService from '../modules/game/vehicule-service';
import BattleRoyaleNamespace from '../modules/game/battle-royale-namespace';
import MapService from '../modules/game/map-service';
import GameObjectService from '../modules/game/game-object-service';

const collections = GameCollections({
    persistHandlers: [new RethinkDBPersistHandler({debug: false})]
});
const gameObjectService = new GameObjectService(collections);

const gameService = new GameService(
    collections,
    new ClientService(collections, new EventService(collections, 'client_listener')),
    new MatchmakingService(collections, new EventService(collections, 'matchmaking_listener')),
    new GameEngine(collections,
        new EventService(collections, 'game_listener'),
        new StormService(collections, new EventService(collections, 'storm_listener')),
        new VehiculeService(collections),
        new MapService(collections),
        gameObjectService),
        new BattleRoyaleNamespace(collections)
    );
export { gameService as GameService, collections as GameCollections };