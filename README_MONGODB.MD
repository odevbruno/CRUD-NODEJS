##---MongoDB---##

docker run \
    --name mongodb \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=senhacodes \
    -p 27017:27017 \
    -d \
    mongo:4


##---MONGO CLIENT---##

docker run \
    --name mongoclient \
    -p 3000:3000 \
    -d \
    --link mongodb:mongodb \
    mongoclient/mongoclient


##--- EXECUTAR UM COMANDO DENTRO DO CONTAINER ---##

docker exec -it mongodb \
    mongo --host localhost -u admin -p senhacodes -authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user:'bruno', pwd:'senhacodes', roles:[{role:'readWrite', db:'herois'}]})"



##--- INICIANDO O CONTAINER DE UMA IMAGEM EXISTENTE ---##

docker start "nome da imagem"