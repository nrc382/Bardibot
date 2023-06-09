const conversazione = require("./conversazione");
const accessorie = require("./controller_accessorie");
const albero_query = require("../../../Utils/albero_query");

const model_utenti = require("../../Models/modello_utenti")
const vista_utenti = require("../../Views/vista_utenti");




// ##########################################################################    DISPATCH delle CALLBACK che iniziano per UTENTE


// Smista ai vari gestori e gestisce il default
module.exports.smista_callback = async (callback) =>{
    switch (callback.data.split(":")[1]) {
        case (albero_query.utente.mostra_id.stmp): { // mostra_id
            return await mostra_id(callback);
        }
        case (albero_query.utente.registra.stmp): { // registrazione
            return await registrazione(callback);
        }
        case (albero_query.utente.menu_utente.stmp): { // Menu
            return await smista_menu_utente(callback);
        }
        default: {
            return await accessorie.prossimamente(callback);
        }
    }
}




// ##########################################################################    REGISTRAZIONE

// Espone la funzione è_registrato del model (verifica se un utente è registrato)
async function è_registrato(id_utente){
    return await model_utenti.è_registrato(id_utente);
}
module.exports.è_registrato = è_registrato;



// Messaggio inviato agli utenti non registrati (Ciao, nuovo abbonato!)
module.exports.nuovo_utente = async (messaggio) =>{
    if (messaggio.from.language_code != "it"){
        // Si dovrebbe avvisare che per il momento non è supportata la localizzazione
    }
    let messaggi_nuovoUtente = vista_utenti.nuovo_utente();
    await conversazione.simula_conversazione(messaggi_nuovoUtente.messaggi, messaggio.chat.id, messaggi_nuovoUtente.opzioni, messaggi_nuovoUtente.delay)
    // alla fine di questa conversazione l'utente può proseguire con la registrazione tramite la callback albero_query.utente.registra
    // gestita dalla funzione registra_utente()
}




// ##########################################################################    ELIMINA REGISTRAZIONE

// Rimuove le informazioni di un utente dall'archivio locale (comando /dimenticami)        
module.exports.dimentica_utente= async (messaggio) =>{
    await model_utenti.elimina_directory_utente(messaggio.chat.id);
    let messaggi_dimentica = vista_utenti.dimentica_utente();
    await conversazione.simula_conversazione(messaggi_dimentica.messaggi, messaggio.chat.id, messaggi_dimentica.opzioni, messaggi_dimentica.delay)    
    // elimino comando e risposta… Anzi! TUTTO QUANTO!
    await conversazione.elimina_tutto(messaggio.chat.id, messaggio.message_id + 1)

}




// ##########################################################################    MENU


// Smista le callback che iniziano per UTENTE:REGISTRAZIONE
async function smista_menu_utente(callback) {
    switch (callback.data.split(":")[2]) {
        // Da aggiungere .esempio e .sviluppo
        case (albero_query.utente.menu_utente.biblioteca_utente.stmp): { 
            return accessorie.prossimamente(callback);
        }
        case (albero_query.utente.menu_utente.collezione_oggetti.stmp): { 
            return accessorie.prossimamente(callback);
        }
        case (albero_query.utente.menu_utente.imposta_pseudonimo.stmp): { 
            return accessorie.prossimamente(callback);
        }
        case (albero_query.utente.menu_utente.racconti_giocati.stmp): { 
            return accessorie.prossimamente(callback);
        }
        default: {
            return menu_utente(callback);
        }
    }
}


// Stampa il menu utente dopo aver caricato info_utente
async function menu_utente (callback) {
    const info_utente = await model_utenti.info_utente(callback.message.chat.id);
    let risposta = vista_utenti.menu_utente(callback, info_utente);

    return await conversazione.invia(risposta);
}








// ##########################################################################               - - - PRIVATE



async function registrazione(callback) {
    // creo la directory
    const registra_utente = await model_utenti.registra_utente(callback.from.id);
    if (registra_utente.esito == false ){
        return await accessorie.stampa_errore(callback.message, registra_utente.msg)
    }
    let messaggi_registrazione = vista_utenti.registrazione(callback.id);
    await conversazione.invia({ query: messaggi_registrazione.query } ); // risposta alla query
    await conversazione.simula_conversazione(messaggi_registrazione.conversazione.messaggi, callback.message.chat.id, messaggi_registrazione.conversazione.opzioni, messaggi_registrazione.conversazione.delay)    
    await conversazione.elimina_comandoerisposta(callback.message.chat.id, callback.message.message_id-1);

    // creo file info_utente


    
}



async function mostra_id(callback) {
    let risposta_callback = vista_utenti.query_mostraID(callback.id, callback.from.id);
    await conversazione.invia(risposta_callback)
}