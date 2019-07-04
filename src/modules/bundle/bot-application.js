import GameService from '../../services/game-service';
import ScriptedApplication from './scripted-application';
import BotRuntimeProxy from './bot-runtime-proxy';

class BotApplication extends ScriptedApplication {
    constructor(script, path, dir) {
        super(script, path, dir);
        this.client = GameService.clients.createClient(this);
        this.behavior = GameService.clients.createBehavior(this.client);
        this.proxy = new BotRuntimeProxy();
    }

    loadRuntime(runtime) {
        this.proxy.setRuntime(runtime);
    }

    ready() {
        try {
            this.proxy.ready(this.client);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    load() {
        try {
            this.proxy.load(this.client, this.behavior);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    start() {
        try {
            this.proxy.start(this.client, this.behavior);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    death() {
        try {
            this.proxy.death(this.client, this.behavior);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }

    update() {
        try {
            this.proxy.update(this.client, this.behavior);
        } catch(err) {
            console.error(this.toScriptingError(err));
        }
    }
}

export default BotApplication;