const utenti = require("./Specifiche/utenti");
const accessorie = require("./Specifiche/accessorie");
const albero_query = require("../../Utils/albero_query");


module.exports.gestisci = async (callback) => {
    switch (callback.data.split(":")[0]) {
        case (albero_query.utente.stmp): {
            return await utenti.gestisci_callback(callback);
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


