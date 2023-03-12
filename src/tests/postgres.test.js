const assert = require('assert');
const ContextStrategy = require('../db/strategies/base/ContextStrategy');
const Postgres = require('../db/Postgres');
const { deepEqual } = require('assert');
const heroiSchema = require('../db/strategies/postgres/schemas/heroisSchema');

const NEW_HEROI = { "nome": "Itachi", "poder": "OVERPOWER" };
const NEW_HEROI_FOR_UPDATE = { "nome": "MELIODAS", "poder": "DARKNESS" };

let postgresDB = {};
// const postgresDB = new ContextStrategy(new Postgres());

describe('TESTING MODULES POSTGRES DB', async function () {

    this.beforeAll(async function () {
        const connection = await Postgres.connect();
        const Model =  await Postgres.defineModel(connection, heroiSchema)
        postgresDB = new ContextStrategy(new Postgres(connection, Model));

        // await postgresDB.delete();
        // await postgresDB.create(NEW_HEROI_FOR_UPDATE);
    })

    it('Connection POSTGRES...', async function () {
        const res = await postgresDB.isConnected();
        assert.deepEqual(res, true);
    });

    it('Testing CREATE in POSTGRES', async function () {
        const res = await postgresDB.create(NEW_HEROI);
        delete res.id
        assert.deepEqual(res, NEW_HEROI)
    });

    it('Testing READ ALL TABLE in POSTGRES', async function () {
        const res = await postgresDB.read();
        console.log(res)
        assert.ok(res);
    });

    it('Testing FILTER READ in POSTGRES', async function () {
        const [res] = await postgresDB.read({ "poder": NEW_HEROI_FOR_UPDATE.poder });
        delete res.id
        assert.deepEqual(res.poder, NEW_HEROI_FOR_UPDATE.poder)
    });

    it('Testing UPDATE in POSTGRES', async function () {
        //Faz um consulta na tabela para encontrar o item/id usando o "nome" como parâmetro
        const [objAtualizar] = await postgresDB.read({ "nome": NEW_HEROI_FOR_UPDATE.nome });

        //Uso a função rest/spread para atualizar o meu JSON
        const novoItem = { ...NEW_HEROI_FOR_UPDATE, nome: "Fred Flinstones" };

        // Consulta realizada, agora tenho os dados do item em [objAtualizar] principalmente o id, 
        // envio o id e o JSON atualizado para o method "update".
        const [resStatus] = await postgresDB.update(objAtualizar.id, novoItem);

        //Realizo uma nova consulta na tabela, porem agora usando o id como parâmetro
        const [resJson] = await postgresDB.read({ "id": objAtualizar.id });

        //Verifico o retorno do method "Update", se for igual 1 então o item foi atualizado, 
        //se for igual 0 item nao foi atualizado!
        assert.deepEqual(resStatus, 1);

        //Com o retorno do method "Read" que teve o id usado como parâmetro em mãos, 
        //verifico se o nome do item consultado está igual ao nome do item no JSON atualizado.
        assert.deepEqual(resJson.nome, novoItem.nome);

    });

    it('Testing DELETE in POSTGRES', async function () {
        const [resConsult] = await postgresDB.read({ "nome": "Fred Flinstones" });
        const resStatus = await postgresDB.delete({ "id": resConsult.id });
        deepEqual(resStatus, 1);
    });
})
