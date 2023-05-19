const utenti = require("./Specifiche/utenti");
const utilità = require("./Specifiche/utilità");
const albero_query = require("../../Utils/albero_query");


module.exports.gestisci = async (callback) => {
    switch (callback.data.split(":")[0]) {
        case (albero_query.utente.stmp): {
            return await utenti.gestisci_utente(callback);
        }
        case (albero_query.chiudi.stmp): {
            return await utilità.chiudi_messaggio(callback);
        }
        case (albero_query.chiudi.puff.stmp): {
            return await utilità.elimina_messaggioecomando(callback);
        }
        default: {
            return await utilità.prossimamente(callback);
        }
    }
}


