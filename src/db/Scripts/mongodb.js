// docker ps

// --- CONECTA, AUTENTIFICA E ABRE O SHELL DO MONGODB --- //
// docker exec -it 66765c58b1ce mongo -u bruno -p senhacodes --authenticationDatabase herois


// --- MOSTRA OS DATABASE'S DO MONGODB --- //
// show dbs

// --- SELECIONA O DATABASE QUE FOR USAR --- //
// use "nome do database"

// --- MOSTRA AS COLLECTIONS DO DATABASE ESCOLHIDO --- //
// show collections

// --- CRIA UMA NOVA COLEÇÃO E JA INSERTA UM NOVO ITEM ---//
// db."NOME_DA_NOVA_COLEÇÃO".insert({})

// db.herois.insert({
//     nome: "Batman",
//     poder: "Money",
//     Nascimento: "1943-01-01"
// });

// db.viloes.insert({
//     nome: "Flash reverso",
//     poder: "God speed",
//     Nascimento: "1943-01-01"
// });

// for (let i = 0; i <= 100; i++) {
//     db.viloes.insert({
//         nome: `Flash clone-${i}`,
//         poder: "God speed",
//         Nascimento: "1943-01-01"
//     });
// }

// db.herois.find()
// db.herois.find().pretty()

// db.viloes.count()
// db.viloes.findOne()
// db.viloes.find().limit(5).sort({ _id: -1 })
// db.viloes.find({}, { poder: 1, _id: 0 }).limit(5)


//##################### --- CRUD --- #######################//


// //CREATE
// db.herois.insert({
//     nome: 'Jhon Constantine',
//     poder: 'Magic',
//     Nascimento: "1903-01-01"
// });


// //READ
// db.herois.find(); //BUSCA TODOS OS ITENS DE UMA COLEÇÃO 
// db.herois.find({ 'Propriedade': 'valor' }); //BUSCA TODOS OS ITENS DA COLEÇÃO QUE TENNHAM O MESMO VALOR QUE FOI PASSADO NO PARAMETRO
// db.herois.findOne({ 'Propriedade': 'valor' }); //BUSCA O ITEM MAIS ANTIGO DA COLEÇÃO QUE CORRESPONDE COM O PARAMETRO INFORMADO


//UPDATE
// db.herois.update({_id: ObjectId("id_do_item")},{ $set: {"":"JSON ATUALIZADO/ OU APENAS A PROP E O VALOR A SER ATUALIZADOS"}});
//     EXAMPLE = db.herois.update({ _id: ObjectId("63fa85934a0d85c7b08427f9") }, { $set: {Nascimento: "2001-01-01" }});


// //DELETE
// db.herois.remove({_id: ObjectId("id_do_item")});
//     EXAMPLE = db.herois.remove({_id: ObjectId("63fa85934a0d85c7b08427f9")});