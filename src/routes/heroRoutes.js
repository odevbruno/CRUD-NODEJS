const BaseRoute = require('./base/baseRoute');
const Boom = require('boom');
const Joi = require('joi');

const failAction = (req, headers, error) => { throw error }

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

const schemas = {
    read: {
        skip: Joi.number().integer().min(0).max(1000).default(0),
        limit: Joi.number().integer().min(1).max(1000).default(10),
        nome: Joi.string().min(3).max(50)
    },
    created: {
        nome: Joi.string().required().min(1).max(100),
        poder: Joi.string().required().min(1).max(100),
    },
    updated: {
        nome: Joi.string().min(1).max(100),
        poder: Joi.string().min(1).max(100)
    },
    _id: {
        id: Joi.string().required()
    }
}

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            method: 'GET',
            path: '/herois',
            config: {
                tags: ['api'],
                description: 'Ler herois',
                notes: 'Você pode ler um heroi especifico ou ler a lista completa',
                validate: {
                    failAction,
                    headers,
                    query: schemas.read
                }
            },
            handler: (request, headers) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query;

                    let query = { nome: { $regex: `.*${nome}*.` } }

                    return this.db.read(nome ? query : {}, skip, limit);
                } catch (error) {
                    return Boom.internal()
                }

            }
        }
    };

    create() {
        return {
            method: 'POST',
            path: '/herois',
            config: {
                tags: ['api'],
                description: 'Cria um novo heroi',
                notes: 'Você pode criar um novo heroi',
                validate: {
                    failAction,
                    headers,
                    payload: schemas.created
                }
            },
            handler: async (request, headers) => {
                try {
                    const {
                        nome,
                        poder
                    } = request.payload;

                    const result = await this.db.create({ nome, poder });
                    return {
                        message: "Heroi cadastrado com sucesso!",
                        _id: result._id
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    };

    update() {
        return {
            method: 'PATCH',
            path: `/herois/{id}`,
            config: {
                tags: ['api'],
                description: 'Atualiza informações do heroi',
                notes: 'Você pode atualizar as informações do heroi',
                validate: {
                    failAction,
                    headers,
                    params: schemas._id,
                    payload: schemas.updated
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const payload = request.payload;

                    const dadosString = JSON.stringify(payload);
                    const dadosJson = JSON.parse(dadosString);

                    const { modifiedCount } = await this.db.update(id, dadosJson);

                    if (modifiedCount !== 1) return Boom.preconditionFailed('Não foi possivel atualizar o documento!')
                    return 'O documento foi atualizado com sucesso!'

                } catch (error) {
                    return Boom.internal()
                }

            }
        }
    };

    delete() {
        return {
            method: 'DELETE',
            path: '/herois/{id}',
            config: {
                validate: {
                    failAction,
                    headers,
                    params: schemas._id
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const result = await this.db.delete(id);

                    if (result.deletedCount !== 1) return Boom.preconditionFailed('Erro ao deletar o documento!');
                    return 'O documento foi deletado!';

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    };

}

module.exports = HeroRoutes;