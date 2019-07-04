import _ from 'lodash';

class EventService {
    constructor(collections, kind) {
        this.kind = kind;
        this.collections = collections;
    }

    on(event, callback, params) {
        // const clientID = (callback !== undefined && client.ID !== undefined ? client.ID : undefined);
        // const e = (callback !== undefined ? event : client);
        // const fn = (callback !== undefined ? callback : event);

        this.collections('runtime').push(this.kind, {
            event,
            callback,
            params
        });
    }

    off(client, event) {
        
    }

    each(event, callback) {
        _.each(this.collections('runtime').kind(this.kind).filter(item => {
            return item.event == event;
        }), listener => {
            callback(listener);
        });
    }

    raise(event, params) {
        _.each(this.collections('runtime').kind(this.kind).filter(item => {
            return item.event == event;
        }), listener => {
            listener.callback(params);
        });
    }

    filter(event, filter) {
        return _.reduce(this.collections('runtime').kind(this.kind), (acc, item) => {
            if (item.event == event && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
}

export default EventService;