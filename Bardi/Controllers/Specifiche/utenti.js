const conversazione = require("./conversazione");
const vista = require("../../Views/vista_utenti");
const albero_query = require("../../../Utils/albero_query");


// ##########################################################################    risposta a CALLBACK

module.exports.gestisci_callback = async (callback) =>{
    switch (callback.data.split(":")[1]) {
        case (albero_query.utente.mostra_id.stmp): { // MOSTRA_ID
            return await mostra_id(callback);
        }
        case (albero_query.utente.registrazione.stmp): { // REGISTRA
            return await menu_registra_utente(callback);
        }
        default: {
            return await prossimamente(callback);
        }
    }
}


// ##########################################################################    REGISTRAZIONE

// Messaggio inviato agli utenti non registrati
module.exports.nuovo_utente = async (messaggio) =>{
    if (messaggio.from.language_code != "it"){
        // Si dovrebbe avvisare che per il momento non è supportata la localizzazione
    }
    let messaggi_nuovoUtente = vista.nuovo_utente();
    await conversazione.simula_conversazione(messaggi_nuovoUtente.messaggi, messaggio.chat.id, messaggi_nuovoUtente.opzioni, messaggi_nuovoUtente.delay)
    // alla fine di questa conversazione l'utente può proseguire con la registrazione tramite la callback albero_query.utente.registra
    // gestita dalla funzione registra_utente()
}

// Gestione callback che iniziano per UTENTE:REGISTRAZIONE
async function menu_registra_utente(callback) {
    switch (callback.data.split(":")[2]) {
        // Da aggiungere .esempio e .sviluppo
        case (albero_query.utente.registrazione.conferma.stmp): { 
            return registrazione(callback);
        }
        default: {
            return prossimamente(callback);
        }
    }
}

// Rimuove le informazioni di un utente dall'archivio locale (comando /dimenticami)        + + + PUBBLICA
module.exports.dimentica_utente= async (messaggio) =>{
    let messaggi_dimentica = vista.dimentica_utente();
    await conversazione.simula_conversazione(messaggi_dimentica.messaggi, messaggio.chat.id, messaggi_dimentica.opzioni, messaggi_dimentica.delay)    
    // elimino comando e risposta… Anzi! TUTTO QUANTO!
    await conversazione.elimina_tutto(messaggio.chat.id, messaggio.message_id + 1)

}

async function registrazione(callback) {
    
}





// ##########################################################################               - - - PRIVATE


async function mostra_id(callback) {
    let risposta_callback = vista.query_mostraID(callback.id, callback.from.id);
    await conversazione.invia({ query: risposta_callback })
}