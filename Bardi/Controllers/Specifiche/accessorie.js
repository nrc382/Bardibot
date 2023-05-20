const conversazione = require("./conversazione");
const vista = require("../../Views/vista_utenti");
const albero_query = require("../../../Utils/albero_query");


 
// Gestisce il default degli switch sui bottoni inline (presumibilmente, se la callback non è accettata lo sarà …prossimamente)
module.exports.prossimamente = async(callback) => {
    let query_risposta = vista.query_prossimamente(callback.id);
    await conversazione.invia({ query: query_risposta })
}

// Risponde al bottone ⨷ ed elimina il messaggio del bot
module.exports.chiudi_messaggio= async(callback) =>{
    let risposta_callback = vista.query_chiudo(callback.id);
    let da_eliminare = vista.elimina(callback.message.chat.id, callback.message.message_id);

    await conversazione.invia({ query: risposta_callback, elimina: da_eliminare });
}

// Risponde al bottone ⨷ ed elimina il messaggio del bot e quello precedente (presumibilmente il comando che l'ha scatenato)
module.exports.elimina_messaggioecomando= async(callback) =>{
    let risposta_callback = vista.query_puff(callback.id);
    await conversazione.invia({ query: risposta_callback });
    await conversazione.elimina_comandoerisposta(callback.message.chat.id, callback.message.message_id - 1);
}