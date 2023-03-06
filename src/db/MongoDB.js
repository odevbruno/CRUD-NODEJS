const Icrud = require('./strategies/interfaces/Icrud');
const Mongoose = require('mongoose');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STATUS = {
    0: 'disconectado',
    1: 'conectado',
    2: 'conectando',
    3: 'disconectando,'
};

class MongoDB extends Icrud {
    //1º
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    //2º
    static connect() {
        Mongoose.connect(process.env.URL_CONNECT_MONGO_DB,
            { useNewUrlParser: true }, function (error) {
                if (!error) return;
                console.error('Falha ao conectar com o banco de dados... ' + error);
            });

        const connection = Mongoose.connection;
        connection.once('open', () => console.log('Banco de dados foi iniciado...'));
        return connection;
    }

    //3º
    async isConnected() {
        const statusConnection = STATUS[this._connection.readyState];
        if (statusConnection === "conectado") return statusConnection;
        if (statusConnection !== "conectando") return statusConnection;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return STATUS[this._connection.readyState];
    }

    create(item) {
        return this._schema.create(item);
    }

    read(query = {}, skip = 0, limit = 0) {
        return this._schema.find(query).skip(skip).limit(limit);
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    delete(uid) {
        return this._schema.deleteOne({ _id: uid })
    }
}

module.exports = MongoDB;