const Hapi = require('@hapi/hapi');
const heroisSchema = require('./db/strategies/mongo/schemas/heroisSchema');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiJwt = require('hapi-auth-jwt2');
const ContextStrategy = require('./db/strategies/base/ContextStrategy');
const MongoDB = require('./db/MongoDB');
const Postgres = require('./db/Postgres');
const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');
const Boom = require('boom');

const SECRET_KEY = 'SENHA_SECRETA_PARA_GERAR_TOKEN'
const swaggerOptions = {
    info: {
        title: 'API HEROIS',
        version: 'v1.0'
    }
}

const mapRoutes = (instance, methods) => {
    return methods.map(method => instance[method]())
}

const main = async () => {
    // #Conexão mongoDB
    const connection = MongoDB.connect();
    const mongoDBconnected = new ContextStrategy(new MongoDB(connection, heroisSchema));

    // #Conexão Postgres
    const connectionPostgres = await Postgres.connect();
    const modelPostgres = await Postgres.defineModel(connectionPostgres, UserSchema);
    const postgresConnected = new ContextStrategy(new Postgres(connectionPostgres, modelPostgres));

    // #Host do servidor
    const servidor = new Hapi.Server({
        port: 5500,
        host: 'localhost'
    });

    // #Registro de plugins
    await servidor.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    // #Estrategia global de autenticação
    servidor.auth.strategy('jwt', 'jwt', {
        key: SECRET_KEY,
        validate: async (dado, request) => {
            const [result] = await postgresConnected.read({
                username: dado.username.toLowerCase(),
                id: dado.id
            });
            if (!result)
                return {
                    isValid: false
                }
            return {
                isValid: true
            }
        }
    });

    servidor.auth.default('jwt')
    servidor.validator(Joi)

    // #Rotas
    servidor.route([
        ...mapRoutes(new HeroRoutes(mongoDBconnected), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(SECRET_KEY, postgresConnected), AuthRoutes.methods())
    ]);

    await servidor.start();
    console.log(`Servidor está online, na porta:${servidor.info.port}`);

    return servidor;
}

module.exports = main();