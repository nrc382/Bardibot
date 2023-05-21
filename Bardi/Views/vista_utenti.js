const model = require("../Models/modelli_messaggi");
const simboli = require("./Testi/simboli.json");
const testi = require("./Testi/Vista utenti/it.json");
const albero_query = require("../../Utils/albero_query");



// ##########################################################################    MESSAGGI


// Sequenza per l'oblio dell'utente
module.exports.dimentica_utente = () => {
    let conversazione = model.conversazione;
    conversazione.messaggi =  testi.dimentica_utente.messaggi.slice();;
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
        [ model.bottone_chiudi_puff ]
    ];


    let conversazione = model.conversazione;
    conversazione.messaggi =  testi.nuovo_utente.messaggi.slice();
    conversazione.opzioni = model.opzioni_standard(tastiera);
    conversazione.delay = 2500;

    return conversazione
}

// Sequenza di benvenuto (e bottone al menu)
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







// ##########################################################################    BOTTONI


// Bottone menu_utente
module.exports.query_menu = (callback_id) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_menu.testo}`;
    risposta.options.show_alert = false;

    return {query: risposta};
}


// Query: Bottone mostra_id. (mostra l'id dell'utente)
module.exports.query_mostraID = (callback_id, id_utente) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_mostraID.testo}${id_utente}`;
    risposta.options.show_alert = true;

    return {query: risposta};
}
