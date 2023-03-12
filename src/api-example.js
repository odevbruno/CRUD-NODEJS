const Hapi = require('hapi');
const heroisSchema = require('./db/strategies/mongo/schemas/heroisSchema');
const ContextStrategy = require('./db/strategies/base/ContextStrategy');
const MongoDB = require('./db/MongoDB');

const main = async () => {
    const connection = MongoDB.connect();
    const mongoDBconnected = new ContextStrategy(new MongoDB(connection, heroisSchema));

    const servidor = new Hapi.Server({
        port: 5000,
        host: 'localhost'
    });

    servidor.route({
        method: 'GET',
        path: '/herois',
        handler: (request, heads) => {
            return mongoDBconnected.read();
        }
    })

    await servidor.start();
    return console.log(`SERVIDOR ESTÁ ON... ${servidor.info.port}`)
}

main()