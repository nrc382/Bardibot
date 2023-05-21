const utenti = require("./Specifiche/controller_utenti");
const accessorie = require("./Specifiche/controller_accessorie");
const albero_query = require("../../Utils/albero_query");


module.exports.smista = async (callback) => {
    switch (callback.data.split(":")[0]) {
        case (albero_query.utente.stmp): {
            return await utenti.smista_callback(callback);
        }
        case (albero_query.chiudi.stmp): {
            return await accessorie.chiudi_messaggio(callback);
        }
        case (albero_query.chiudi.puff.stmp): {
            return await accessorie.elimina_messaggioecomando(callback);
        }
        default: {
            return await accessorie.prossimamente(callback);
        }
    }
}


