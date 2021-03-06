import _ from 'lodash';
import Clock from '../../components/clock';
import { GameService } from '../../services/game-service';
import { GameObject } from './game-object';
import { toSeconds, toMinutes } from './time';

class GameEngine {
    constructor(collections, eventService, stormService, vehiculesService, mapService, gameObjectService) {
        this.collections = collections;
        this.events = eventService;
        this.config = {
            death_delay: toMinutes(5)
        };
        this.tick = new Clock();
        this.eventTriggers = {};
        this.storm = stormService;
        this.vehicules = vehiculesService;
        this.map = mapService;
        this.go = gameObjectService;
        this.isRunning = false;
    }

    initMap () {
        const travelPlane = this.vehicules.createTravelPlane();
        const planeGO = GameObject.instantiate(travelPlane);
        planeGO.transform.setPosition(this.map.dropTravelPath.start.x * this.map.worldSize.x, this.map.dropTravelPath.start.y * this.map.worldSize.y, 0);
        planeGO.transform.setRotation(this.map.dropTravelPath.vector.x, this.map.dropTravelPath.vector.y, 0);
        const players = GameService.matchmaking.getPlayers();
        _.each(players, (player, idx) => {
            let go = GameObject.instantiate(player.player);
            go.parent = planeGO;
            travelPlane.enterPlayer(idx, player.player);
        });
    }

    execPlayerAction(player, action, params) {
        let vehicule;
        switch (action) {
            case 'eject': {
                if (player.vehicule && player.vehicule.exitPlayer) {
                    vehicule = player.vehicule;
                    player.gameObject.transform.position = _.clone(vehicule.gameObject.transform.position);
                    player.gameObject.parent = null;
                    vehicule.exitPlayer(player);
                    this.collections('game').filterOneUpdate('behavior', be => be.behaviorID === player.behavior.ID, cli => {
                        cli.behavior.addTag('landed');
                    });
                    this.events.fireFilter('landed', listener => listener.params.clientID === player.client.ID);
                }
                break;
            }
            default:
                break;
        }
    }

    start() {
        this.initMap();
        this.go.start();
        this.tick.start();
        GameService.matchmaking.events.fire('start');
        this.events.fire('matchmaking_start');
        this.collections('game').kindUpdate('behavior', cli => {
            cli.behavior.addTag('alive');
        });
        this.storm.start();
        this.isRunning = true;
    }

    update(time) {
        const ms = time.total / 1000;

        this.storm.update(time);
        this.go.update(time);
        if (!this.eventTriggers.death && ms > this.config.death_delay) {
            this.tick.stop();
            this.collections('game').kindUpdate('behavior', cli => {
                cli.behavior.setTags(['landed', 'dead']);
            });
            this.events.fire('death');
            this.eventTriggers.death = true;
            this.isRunning = false;
        }
    }
}

export default GameEngine;