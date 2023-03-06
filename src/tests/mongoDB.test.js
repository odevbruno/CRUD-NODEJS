const heroisSchema = require('../db/strategies/mongo/schemas/heroisSchema');
const ContextStrategy = require('../db/strategies/base/ContextStrategy');
const MongoDB = require('../db/MongoDB');
const assert = require('assert');
const { deepEqual } = require('assert');

const NEW_HEROI = {
    nome: "Itachi",
    poder: "Genjutsu"
};

const NEW_HEROI_FOR_UPDATE = {
    nome: "MELIODAS",
    poder: "DARKNESS"
};

const HEROI_SPEED = {
    nome: 'Mercurio',
    poder: 'Speed',
}

const HEROI_DEFAULT = {
    nome: `CHAPOLIN - ${Date.now()}`,
    poder: 'OP',
}

let HEROI_ID = ''

let mongoDB = ''
// const mongoDB = new ContextStrategy(new MongoDB());

describe('TESTING ALL SUITES MONGO_DB', async function () {
    this.timeout(Infinity);
    
    this.beforeAll(async function () {
        const connection = MongoDB.connect();
        mongoDB = new ContextStrategy(new MongoDB(connection, heroisSchema));

        const response = await mongoDB.create(HEROI_DEFAULT);
        HEROI_ID = response._id

    })

    it('Connection mongoDB...', async function () {
        const expected = 'conectado';
        const res = await mongoDB.isConnected();
        console.log(res)
        deepEqual(res, expected);
    });

    it('Create item in mongoDB...', async function () {
        const { nome, poder } = await mongoDB.create(NEW_HEROI);
        // console.log(nome, poder)
        deepEqual({ nome, poder }, NEW_HEROI);
    });

    it('Reading in mongoDB...', async function () {
        //FIND ALL DATABASE
        const ALL = await mongoDB.read({})
        // console.log(ALL)

        //FIND ITEM FILTERED IN DATABASE
        // const [{ nome, poder }] = await mongoDB.read({ poder: HEROI_SPEED.poder });

        //Teste de verificação
        // deepEqual({ nome, poder }, HEROI_SPEED);
    });

    it('Update item in MongoDB...', async function () {
        const { modifiedCount } = await mongoDB.update(HEROI_ID, {
            nome: "Patolino"
        });
        const ALL = await mongoDB.read({})
        // console.log(ALL)

        assert.deepEqual(modifiedCount, 1);
    });

    it('Remove item in mongoDB...', async function () {
        const { deletedCount } = await mongoDB.delete(HEROI_ID);
        assert.deepEqual(deletedCount, 1);
    });

});