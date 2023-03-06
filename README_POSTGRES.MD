##---postgres---##

docker run \
    --name postgres \
    -e POSTGRES_USER=brcodes \
    -e POSTGRES_PASSWORD=senhacodes \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres
    
##---Adminer ---##

docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer


##--- INICIANDO O CONTAINER DE UMA IMAGEM EXISTENTE ---##

docker start "nome da imagem"