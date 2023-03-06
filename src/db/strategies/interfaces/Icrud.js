class MethodNotImplemeted extends Error {
    constructor() {
        super("Exception: Method Not Implemeted")
    }
};

class Icrud {
    create(item) {
        throw new MethodNotImplemeted()
    }

    read(query, skip, limit) {
        throw new MethodNotImplemeted()
    }

    update(id, item) {
        throw new MethodNotImplemeted()
    }

    delete(id) {
        throw new MethodNotImplemeted()
    }

    isConnected(){
        throw new MethodNotImplemeted()
    }

    connect(){
        throw new MethodNotImplemeted()
    }
}


module.exports = Icrud;