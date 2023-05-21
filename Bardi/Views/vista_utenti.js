const albero_query = require("../../Utils/albero_query");
const model = require("../Models/message_model");
const simboli = require("./Testi/simboli.json");
const testi = require("./Testi/Vista utenti/it.json");


module.exports.dimentica_utente = () => {
    let conversazione = model.conversazione;
    conversazione.messaggi =  testi.dimentica_utente.messaggi.slice();;
    conversazione.opzioni = model.opzioni_standard();
    conversazione.delay = 3000;

    return conversazione
}

module.exports.nuovo_utente = () => {
    let tastiera = [
        [
            { text: "id?", callback_data: `${model.genera_percorso_callback(albero_query.utente.mostra_id.stmp)}` },
            { text: simboli.info, callback_data: `${model.genera_percorso_callback(albero_query.utente.registrazione.esempio.stmp)}` },
            { text: simboli.bot, callback_data: `${model.genera_percorso_callback(albero_query.utente.registrazione.sviluppo.stmp)}` },
            { text: simboli.entra, callback_data: `${model.genera_percorso_callback(albero_query.utente.registrazione.conferma.stmp)}` }
        ],
        [ model.bottone_chiudi_puff ]
    ];


    let conversazione = model.conversazione;
    conversazione.messaggi =  testi.nuovo_utente.messaggi.slice();
    conversazione.opzioni = model.opzioni_standard(tastiera);
    conversazione.delay = 2500;

    return conversazione
}


module.exports.registrazione = (callback_id) => {
    let risposta_query = model.query;
    risposta_query.id = callback_id;
    risposta_query.options.text = `${testi.query_registrazione.testo}`;
    risposta_query.options.show_alert = true;

    let tastiera = [
        [ model.bottone_torna_al_menu ]
    ];
    let conversazione = model.conversazione;
    conversazione.messaggi =  testi.registrazione_utente.messaggi.slice();;
    conversazione.opzioni = model.opzioni_standard(tastiera);
    conversazione.delay = 1500;

    return {query: risposta_query, conversazione: conversazione}

}

module.exports.menu_utente = (input, info_utente) => {
    let tastiera = [
        [ model.bottone_torna_al_menu ]
    ];
    
    let risposta = {};
    if (input.hasOwnProperty("id")){ // è una callback: devo modificare il messaggio
        risposta.modifica = model.modifica;

    } else { // Il menù è stato aperto da un comando... devo inviare il messaggio (ed eliminare il comando)
        risposta.elimina = -1;
        risposta.invia = "";
    }

    return risposta

}


module.exports.query_menu = (callback_id) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_menu.testo}`;
    risposta.options.show_alert = false;

    return risposta;
}


// Query: Bottone mostra id. Mostra l'id dell'utente 
module.exports.query_mostraID = (callback_id, id_utente) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_mostraID.testo}${id_utente}`;
    risposta.options.show_alert = true;

    return risposta;
}

// Query: Bottone mostra id. Mostra l'id dell'utente 
module.exports.risposta_generica = (messaggio) => {
    // let query = model.query;
    // query.id = callback.id;
    // query.options.text = `${testi.query_generica.testo}`;
    // query.options.show_alert = false;

    let invia = model.invia;
    invia.chat_id = messaggio.chat.id;
    invia.testo= `${testi.query_generica.testo}`;

    return {invia: invia};
}