const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelpers')

const SENHA = "@BrunoDelas"
const HASH = "$2b$10$uRrgqeoaidJJBwWktR8mOuxT.kaooyt0coZzJG81wOm8SYUpTqr8C"

describe('Suite de test password helper', function () {
    it('Create a hash', async () => {
        const res = await PasswordHelper.hashPassword(SENHA);
        assert.ok(res.length > 10)
    });

    it.only('Verifica hash', async () => {
        const res = await PasswordHelper.compareHash(SENHA, HASH);
        assert.ok(res)
    });
})