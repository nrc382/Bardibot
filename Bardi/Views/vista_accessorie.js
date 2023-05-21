
const model = require("../Models/modelli_messaggi");
const testi = require("./Testi/Vista accessorie/it.json");
const simboli = require("./Testi/simboli.json");
const albero_query = require("../../Utils/albero_query");



// Il menu generale
module.exports.menu_generale = (input, statistiche) => {
    let tastiera = [
        [
            { text: simboli.utente, callback_data: `${model.genera_percorso_callback(albero_query.utente.menu_utente.stmp)}` },
            { text: simboli.racconti_pubblici, callback_data: `${model.genera_percorso_callback(albero_query.racconti.lista.stmp)}` },
            { text: simboli.info, callback_data: `${model.genera_percorso_callback(albero_query.guide.generali.stmp)}` },
            { text: simboli.bot, callback_data: `${model.genera_percorso_callback(albero_query.info.sviluppo.stmp)}` },
           
        ],
        [ model.bottone_chiudi ]
    ];
    let testo = testi.menu_generale.titolo;
    

    let risposta = {};
    if (input.hasOwnProperty("id")){ // è una callback: devo modificare il messaggio
        risposta.modifica = model.modifica;
        risposta.modifica.options = model.opzioni_standard(tastiera);
        risposta.modifica.testo = testo;
        risposta.modifica.chat_id = input.message.chat.id;
        risposta.modifica.msg_id = input.message.message_id;
    } else { // Il menù è stato aperto da un comando... devo inviare il messaggio (ed eliminare il comando)
        risposta.elimina = model.elimina;
        risposta.elimina.chat_id = input.chat.id;
        risposta.elimina.msg_id = input.message_id;
        risposta.invia = model.invia;
        risposta.invia.chat_id = input.chat.id;
        risposta.invia.testo = testo;
        risposta.invia.options = model.opzioni_standard(tastiera);
    }


    return risposta

}

// Query: Banner "Prossimamente". Risponde al default degli switch
module.exports.query_prossimamente = (id, data) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `${testi.query_prossimamente.testo}\n\n${data}`;
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

// Funzione: Messaggio di errore 
module.exports.stampa_errore = (chat_id, errore) => {
    let tastiera = [ [model.bottone_contatta_admin] ];

    let risposta = model.invia;
    risposta.chat_id = chat_id;
    risposta.testo = `${testi.stampa_errore}${errore}`;
    risposta.options = model.opzioni_standard(tastiera);

    return risposta

}