const Sequelize = require('sequelize');
const heroiSchema = {
    name: 'herois',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'tb_heroes',
        freezeTableName: false,
        timestamps: false
    },
}

module.exports = heroiSchema;