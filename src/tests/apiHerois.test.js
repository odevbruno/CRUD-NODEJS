const assert = require('assert');
const api = require('../api');
let app = {};

const DEFAULT_HEROI = { nome: "ABADOM", poder: "eu sou do mal rapazkkk" }
const DEFAULT_HEROI_UPDATE = { nome: "ZEUS", poder: "RAIOS" }
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGExMjMiLCJpZCI6MTIsImlhdCI6MTY3ODU0Nzk0NX0.HsN2BWF6vnXWYmkxnTNpkf2wZT5sSEkZN2HQtwnkUAE";
const headers = { authorization: token }
let HEROI_ID = ''

describe('SUITE DE TESTE', function () {
    this.beforeAll(async () => {
        app = await api;
        const { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: JSON.stringify(DEFAULT_HEROI_UPDATE)
        });
        HEROI_ID = result._id
    });

    it('listar GET /herois', async () => {
        const res = await app.inject({
            method: 'GET',
            headers,
            url: '/herois'
        });
        const dadosHerois = JSON.parse(res.payload);
        const status = res.statusCode
        assert.deepEqual(status, 200);
        assert.ok(Array.isArray(dadosHerois))
    });

    it('listar GET /herois <----> deve retornar 5 itens', async () => {
        const tamanho_limite = 5

        const res = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${tamanho_limite}`
        });

        const dadosHerois = JSON.parse(res.payload);
        const status = res.statusCode
        assert.deepEqual(status, 200);
        assert.ok(dadosHerois.length === tamanho_limite)
    });

    it('create POST /herois', async () => {
        const response = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: JSON.stringify(DEFAULT_HEROI)
        });
        const { result } = response;
        assert.ok(response.statusCode === 200)
        assert.deepEqual(result.message, "Heroi cadastrado com sucesso!")
    });

    it('update PATCH /herois <------> atualiza item', async () => {
        const id = HEROI_ID;
        const expected = {
            poder: "Criar corno"
        };
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${id}`,
            payload: JSON.stringify(expected)
        });

        assert.deepEqual(result.result, 'O documento foi atualizado com sucesso!')
    });


})