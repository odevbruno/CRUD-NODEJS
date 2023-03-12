// #libs
const BaseRoute = require("./base/baseRoute");
const Boom = require('boom');
const Joi = require('joi');
const JWT = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelpers');

// #objects
const ACC_DEFAULT = {
    username: '',
    password: ''
}

const failAction = (req, headers, error) => {
    throw error
}

// #class/functions
class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            method: 'POST',
            path: '/login',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter o token de acesso!',
                notes: 'Entre com seu username e password para obter o token de acesso para utilizar a API',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { username, password } = request.payload;

                    // #Verifica se existe o registro de usuario no banco de dados
                    const [result] = await this.db.read({
                        username: username.toLowerCase()
                    });

                    if (!result) {
                        return Boom.unauthorized('O usuário não existe!');
                    };

                    // #Verifica se a senha informada está correta, verificando a hash
                    const match = await PasswordHelper.compareHash(password, result.password);

                    if (!match) {
                        return Boom.unauthorized('O usuario ou senha estão incorretos!');
                    };

                    // #Se tudo estiver de forma correta gera o token de acesso para o usuario
                    const token = JWT.sign({
                        username: username,
                        id: result.id
                    }, this.secret);

                    return {
                        token
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    };

    register() {
        return {
            method: 'POST',
            path: '/register',
            config: {
                auth: false,
                // tags: ['api'],
                // description: 'Obter o token de acesso!',
                // notes: 'Entre com seu username e password para obter o token de acesso para utilizar a API',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (params) => {
                try {
                    const payload = params.payload;
                    const loweredUsername = payload.username.toLowerCase()
                    const res = await this.db.read({ username: loweredUsername })

                    if (res.length > 0 || !res) {
                        return Boom.preconditionFailed('Username em uso, tente outro!')
                    };

                    const hashGenerated = await PasswordHelper.hashPassword(payload.password);
                    const newPayload = {
                        ...payload,
                        username: loweredUsername,
                        password: hashGenerated
                    };

                    const result = await this.db.create(newPayload);

                    // #Se tudo estiver de forma correta gera o token de acesso para o usuario
                    const token = JWT.sign({
                        username: payload.username,
                        id: result.id
                    }, this.secret);

                    return {
                        token
                    }

                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }

    list() {
        return {
            method: 'GET',
            path: '/users',
            config: {
                auth: false,
                validate: {
                    failAction
                }
            },
            handler: async (params) => {
                try {
                    const result = await this.db.read();
                    return result;
                } catch (error) {
                    return Boom.internal();
                }
            }
        }
    }
}


module.exports = AuthRoutes