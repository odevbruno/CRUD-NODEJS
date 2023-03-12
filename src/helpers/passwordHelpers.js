const bcrypt = require('bcrypt');
const { promisify } = require('util');
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);
const SALT = 10;

class PasswordHelper {
    static hashPassword(password){
        return hashAsync(password, SALT)
    }

    static compareHash(password, hash){
        return compareAsync(password, hash)
    }
}

module.exports = PasswordHelper