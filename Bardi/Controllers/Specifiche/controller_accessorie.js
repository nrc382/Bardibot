const conversazione = require("./conversazione");
const vista_accessorie = require("../../Views/vista_accessorie");
const modello_accessorie = require("../../Models/modello_accessorie")





// Stampa il menu generale dopo aver caricato statistiche_bot
async function menu_generale(input) {
    let risposta;
    let messaggio = è_callback(input) ? input.message : input;
    const statistiche_bot = await modello_accessorie.statistiche_bot();

    if (statistiche_bot.esito == false){
        risposta = accessorie.stampa_errore(messaggio, statistiche_bot.msg);
    } else {
        risposta = vista_accessorie.menu_generale(input, statistiche_bot.dati);
    }

    return await conversazione.invia(risposta);
}
module.exports.menu_generale = menu_generale;

 
// Gestisce il default degli switch sui bottoni inline (presumibilmente, se la callback non è accettata lo sarà …prossimamente)
module.exports.prossimamente = async(callback) => {
    let query_risposta = vista_accessorie.query_prossimamente(callback.id, callback.data);
    await conversazione.invia({ query: query_risposta })
}

// Risponde al bottone ⨷ ed elimina il messaggio del bot
module.exports.chiudi_messaggio= async(callback) =>{
    let risposta_callback = vista_accessorie.query_chiudo(callback.id);
    let da_eliminare = vista_accessorie.elimina(callback.message.chat.id, callback.message.message_id);

    await conversazione.invia({ query: risposta_callback, elimina: da_eliminare });
}

// Risponde al bottone ⨷ ed elimina il messaggio del bot e quello precedente (presumibilmente il comando che l'ha scatenato)
module.exports.elimina_messaggioecomando= async(callback) =>{
    let risposta_callback = vista_accessorie.query_puff(callback.id);
    await conversazione.invia({ query: risposta_callback });
    await conversazione.elimina_comandoerisposta(callback.message.chat.id, callback.message.message_id - 1);
}

// Gestisce eventuali errori 
module.exports.stampa_errore = async (messaggio, errore) => {
    let stampa_errore = vista_accessorie.stampa_errore(messaggio.chat.id, errore);
    await conversazione.invia({invia: stampa_errore});
}


// Funzione: ritorna vero se input ha la proprietà id (e non message_id). Dovrebbe distinguere tra callback e messaggio 
function è_callback(input) {
    return (!input.hasOwnProperty("message_id") && input.hasOwnProperty("id")) ;
}
module.exports.è_callback = è_callback