
const model = require("../Models/message_model");
const testi = require("./Testi/Vista utenti/it.json");


// Query: Banner "Prossimamente". Risponde al default degli switch
module.exports.query_prossimamente = (id) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `${testi.query_prossimamente.testo}`;
    risposta.options.show_alert = true;

    return risposta;
}

// Query: Banner "Chiudo". Chiusura di un messaggio del bot
module.exports.query_chiudo = (id) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `${testi.query_chiudo.testo}`;;
    risposta.options.show_alert = false;
    risposta.options.cache_time = 2;

    return risposta;
}

// Query: Banner "Puff!". Eliminazione di messaggio del bot e precedente (comando?)
module.exports.query_puff = (id) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `${testi.query_puff.testo}`;;
    risposta.options.show_alert = false;
    risposta.options.cache_time = 2;

    return risposta;
}

// Funzione: Eliminazione di un messaggio 
module.exports.elimina = (chat_id, id_messaggio) => {
    let da_eliminare = model.elimina;
    da_eliminare.chat_id = chat_id;
    da_eliminare.msg_id = id_messaggio;
    return da_eliminare;
}
