const model = require("../Models/modelli_messaggi");
const simboli = require("./Testi/simboli.json");
const testi = require("./Testi/Vista utenti/it.json");
const albero_query = require("../../Utils/albero_query");



// ##########################################################################    MESSAGGI


// Sequenza per l'oblio dell'utente
module.exports.dimentica_utente = () => {
    let conversazione = model.conversazione;
    conversazione.messaggi = testi.dimentica_utente.messaggi.slice();;
    conversazione.opzioni = model.opzioni_standard();
    conversazione.delay = 3000;

    return conversazione
}

// Sequenza pre registrazione (è inviata in risposta a qualunque input)
module.exports.nuovo_utente = () => {
    let tastiera = [
        [
            { text: simboli.info, callback_data: `${model.genera_percorso_callback(albero_query.guide.generali.stmp)}` },
            { text: simboli.bot, callback_data: `${model.genera_percorso_callback(albero_query.info.sviluppo.stmp)}` },
            { text: simboli.entra, callback_data: `${model.genera_percorso_callback(albero_query.utente.registra.stmp)}` }
        ],
        [model.bottone_chiudi_puff]
    ];


    let conversazione = model.conversazione;
    conversazione.messaggi = testi.nuovo_utente.messaggi.slice();
    conversazione.opzioni = model.opzioni_standard(tastiera);
    conversazione.delay = 2500;

    return conversazione
}

// Sequenza di benvenuto (e bottone al menu_generale)
module.exports.registrazione = (callback_id) => {
    let risposta_query = model.query;
    risposta_query.id = callback_id;
    risposta_query.options.text = `${testi.query_registrazione.testo}`;
    risposta_query.options.show_alert = true;

    let tastiera = [
        [model.bottone_torna_al_menu]
    ];
    let conversazione = model.conversazione;
    conversazione.messaggi = testi.registrazione_utente.messaggi.slice();;
    conversazione.opzioni = model.opzioni_standard(tastiera);
    conversazione.delay = 1500;

    return { query: risposta_query, conversazione: conversazione }

}

module.exports.menu_utente = (callback, info_utente) => {
    let risposta = { query: model.query, modifica: model.modifica };
    risposta.query.id = callback.id;
    risposta.query.options.text = testi.query_menu.testo;
    risposta.modifica.chat_id = callback.message.chat.id;
    risposta.modifica.msg_id = callback.message.message_id;
    risposta.modifica.testo = testi.menu_utente.titolo;

    // pseudonimo
    let pseudonimo = info_utente.pseudonimo.length > 0 ? info_utente.pseudonimo : testi.menu_utente.pseudonimo.non_inpostato
    risposta.modifica.testo += contestualizza_testo(testi.menu_utente.pseudonimo.linea, testi.menu_utente.pseudonimo.parametro, pseudonimo);

    // Biblioteca
    risposta.modifica.testo += contestualizza_lunghezza_array(testi.menu_utente.biblioteca, info_utente.biblioteca);

    // Giocati
    risposta.modifica.testo += contestualizza_lunghezza_array(testi.menu_utente.giocati, info_utente.racconti_giocati);

    if (info_utente.racconti_giocati.length > 0) {
        // Collezione
        risposta.modifica.testo += contestualizza_lunghezza_array(testi.menu_utente.collezione, info_utente.collezione);
    }


    let tastiera = [
        [
            { text: simboli.indietro, callback_data: `${model.genera_percorso_callback(albero_query.menu_generale.stmp)}` },
            { text: simboli.pseudonimo, callback_data: `${model.genera_percorso_callback(albero_query.utente.menu_utente.imposta_pseudonimo.stmp)}` },
            { text: simboli.biblioteca, callback_data: `${model.genera_percorso_callback(albero_query.utente.menu_utente.biblioteca_utente.stmp)}` },
            { text: simboli.collezione, callback_data: `${model.genera_percorso_callback(albero_query.utente.menu_utente.collezione_oggetti.stmp)}` },
            { text: simboli.racconti_giocati, callback_data: `${model.genera_percorso_callback(albero_query.utente.menu_utente.racconti_giocati.stmp)}` },

        ]
    ]

    risposta.modifica.options = model.opzioni_standard(tastiera);

    return risposta;
}

function contestualizza_testo(stringa, parametro, variabile) {
    return stringa.split(parametro).join(variabile);
}

function contestualizza_lunghezza_array(oggetto, lista) {
    switch (lista.length) {
        case 0: {
            return oggetto.nessuno;
        } case 1: {
            return oggetto.solo_uno;
        }
        default: {
            return contestualizza_testo(oggetto.piu_duno, oggetto.parametro, lista.length);
        }
    }

}





// ##########################################################################    BOTTONI


// Bottone menu_utente
module.exports.query_menu = (callback_id) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_menu.testo}`;
    risposta.options.show_alert = false;

    return { query: risposta };
}


// Query: Bottone mostra_id. (mostra l'id dell'utente)
module.exports.query_mostraID = (callback_id, id_utente) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_mostraID.testo}${id_utente}`;
    risposta.options.show_alert = true;

    return { query: risposta };
}
