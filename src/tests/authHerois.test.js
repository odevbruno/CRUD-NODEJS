const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/ContextStrategy');
const PostGres = require('../db/Postgres');
const userSchema = require('../db/strategies/postgres/schemas/userSchema');

let app = {};
let db = {};

const ACC_DEFAULT = {
    username: 'xuxa123',
    password: '123'
}

describe('Suites of authentication', function () {
    this.beforeAll(async () => {
        app = await api
        const connection = await PostGres.connect();
        const Model = await PostGres.defineModel(connection, userSchema)
        db = new Context(new PostGres(connection, Model));
    })

    it.only('Authentication register', async () => {
        const { result } = await app.inject({
            method: 'POST',
            url: '/register',
            payload: ACC_DEFAULT
        })
        console.log(result)
        // assert.ok(result.statusCode === 200)
    }) 

    it('Authentication login', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: ACC_DEFAULT
        })

        assert.ok(result.statusCode === 200)
    })

})