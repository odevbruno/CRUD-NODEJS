const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const Icrud = require('../db/strategies/interfaces/Icrud');
const Sequelize = require('sequelize');

class Postgres extends Icrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    };

    static async connect() {
        const connection = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PWD, {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            port: process.env.DB_PORT,
            quoteIdentifiers: false,
            operatorsAliases: false
        });
        return connection;
    };

    static async defineModel(connection, schema) {
        const model = connection.define(schema.name, schema.schema, schema.options);
        await model.sync();
        return model
    };

    async isConnected() {
        try {
            await this._connection.authenticate()
            return true;
        } catch (error) {
            console.error(error)
            return false;
        }
    };

    async create(item) {
        try {
            const { dataValues } = await this._schema.create(item)
            return dataValues

        } catch (error) {
            throw Error(error)
        }
    };

    async read(query = {}) {
        return await this._schema.findAll({ where: query, raw: true });
    };

    async update(id, item) {
        const status = await this._schema.update(item, { where: { id: id } });
        return status;
    };

    async delete(id) {
        const query = id ? { id } : {}
        return await this._schema.destroy({ where: query })
    };
}

module.exports = Postgres;
