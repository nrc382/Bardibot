const conversazione = require("../conversazione");
const vista = require("../../Views/vista_utenti");
const albero_query = require("../../../Utils/albero_query");


// ##########################################################################    CALLBACK

module.exports.gestisci_callback = async (callback) =>{
    switch (callback.data.split(":")[1]) {
        case (albero_query.utente.mostra_id.stmp): { // MOSTRA_ID
            await mostra_id(callback);
            break;
        }
        case (albero_query.utente.registra.stmp): { // REGISTRA
            await registra_utente(callback);
            break;
        }
        default: {
            await prossimamente(callback);
            break;
        }
    }
}

async function mostra_id(callback) {
    let risposta_callback = vista.query_mostraID(callback.id, callback.from.id);
    await conversazione.invia({ query: risposta_callback })
}

async function registra_utente(callback) {
    let risposta_callback = {};

    switch (callback.data.split(":")[2]) {
        case (albero_query.utente.registra.info.stmp): { 
            await mostra_id(callback);
            break;
        }
        case (albero_query.utente.registra.stmp): { 
            await registra_utente(callback);
            break;
        }
        default: {
            await prossimamente(callback);
            break;
        }
    }
}

// ##########################################################################    MESSAGGI

// Rimuove le informazioni di un utente dall'archivio locale
module.exports.dimentica_utente= async (messaggio) =>{
    let messaggi_dimentica = vista.dimentica_utente();
    await conversazione.simula_conversazione(messaggi_dimentica.messaggi, messaggio.chat.id, messaggi_dimentica.opzioni, messaggi_dimentica.delay)    
    // elimino comando e risposta… Anzi! TUTTO QUANTO!
    await conversazione.elimina_tutto(messaggio.chat.id, messaggio.message_id + 1)

}

module.exports.nuovo_utente = async (messaggio) =>{
    if (messaggio.from.language_code != "it"){
        // Si dovrebbe avvisare che per il momento non è supportata la localizzazione
    }
    let messaggi_nuovoUtente = vista.nuovo_utente();
    await conversazione.simula_conversazione(messaggi_nuovoUtente.messaggi, messaggio.chat.id, messaggi_nuovoUtente.opzioni, messaggi_nuovoUtente.delay)
    // alla fine di questa conversazione l'utente può proseguire con la registrazione tramite la callback albero_query.utente.registra
    // gestita dalla funzione registra_utente()
}